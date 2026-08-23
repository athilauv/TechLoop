import { useMemo } from "react";

function decodeTokenUserId(): string | null {
    try {
        const token = localStorage.getItem("accessToken");

        if (!token) return null;
        const payload = token.split(".")[1];

        if (!payload) return null;
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")),);

        return (
            decoded.sub ??
            decoded.userId ??
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] ??
            null
        );
    } catch {
        return null;
    }
}

export const useCurrentUserId = (): string | null => {
    return useMemo(() => decodeTokenUserId(), []);
};

export const isSameUser = (a?: string | null, b?: string | null): boolean => {
    if (!a || !b) return false;
    return a.toString().trim().toLowerCase() === b.toString().trim().toLowerCase();
};
