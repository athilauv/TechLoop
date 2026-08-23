export interface StoredCurrentUser {
    id?: string;
    username?: string;
}

export function getCurrentUserFromStorage(
    providedUserId?: string
): StoredCurrentUser {
    let id = providedUserId?.trim() || localStorage.getItem("userId")?.trim() || undefined;

    let username =
        localStorage.getItem("username")?.trim() ||
        localStorage.getItem("userName")?.trim() ||
        undefined;

    const token = localStorage.getItem("accessToken");

    if (token && (!id || !username)) {
        try {
            const parts = token.split(".");

            if (parts.length === 3) {
                const base64Url = parts[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

                const json = decodeURIComponent(
                    atob(padded)
                        .split("")
                        .map(
                            (character) =>
                                "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
                        )
                        .join("")
                );

                const payload = JSON.parse(json) as Record<string, unknown>;

                if (!id) {
                    const tokenUserId =
                        payload["sub"] ??
                        payload["userId"] ??
                        payload["nameid"] ??
                        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                    if (typeof tokenUserId === "string") {
                        id = tokenUserId.trim();
                    }
                }

                if (!username) {
                    const tokenUsername =
                        payload["unique_name"] ??
                        payload["username"] ??
                        payload["userName"] ??
                        payload["preferred_username"] ??
                        payload["name"] ??
                        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                    if (typeof tokenUsername === "string") {
                        username = tokenUsername.trim();
                    }
                }
            }
        } catch {
            // Ignore invalid token payload — fall through with whatever we have.
        }
    }

    return { id, username };
}

export function isOwnedByCurrentUser(
    currentUser: StoredCurrentUser,
    entity: { userId?: string; userName?: string }
): boolean {
    const normalizedCurrentUserId = currentUser.id?.trim().toLowerCase();
    const normalizedEntityUserId = entity.userId?.trim().toLowerCase();

    const normalizedCurrentUsername = currentUser.username?.trim().toLowerCase();
    const normalizedEntityUsername = entity.userName?.trim().toLowerCase();

    return (
        (!!normalizedCurrentUserId &&
            !!normalizedEntityUserId &&
            normalizedCurrentUserId === normalizedEntityUserId) ||
        (!!normalizedCurrentUsername &&
            !!normalizedEntityUsername &&
            normalizedCurrentUsername === normalizedEntityUsername)
    );
}
