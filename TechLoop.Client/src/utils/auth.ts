export function getCurrentUserId(): string | undefined {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return undefined;
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.sub || payload.nameid;
    } catch {
        return undefined;
    }
}