export function getCurrentUserId():
    string | undefined {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId?.trim()) {
        return storedUserId.trim();
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        return undefined;
    }

    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return undefined;
        }

        const base64Url = parts[1];
        const base64 = base64Url
                .replace(/-/g, "+")
                .replace(/_/g, "/");

        const jsonPayload = decodeURIComponent(atob(base64)
                    .split("")
                    .map((char) => "%" + ("00" + char
                                    .charCodeAt(0)
                                    .toString(16))
                        .slice(-2))
                    .join("")
            );

        const payload = JSON.parse(jsonPayload) as Record<string, unknown>;
        const userId = payload["sub"] ?? payload["userId"] ?? payload["nameid"] ?? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (typeof userId === "string") {
            return userId;
        }

        return undefined;
    } catch {
        return undefined;
    }
}