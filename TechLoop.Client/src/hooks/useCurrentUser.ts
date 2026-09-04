import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";
import {
    getCurrentUserFromStorage,
    isOwnedByCurrentUser,
    type StoredCurrentUser,
} from "../utils/getCurrentUserFromStorage";

export interface UseCurrentUserResult extends StoredCurrentUser {
    owns: (entity: { userId?: string; userName?: string }) => boolean;
}

export function useCurrentUser(providedUserId?: string): UseCurrentUserResult {
    const storedUser = useMemo(
        () => getCurrentUserFromStorage(providedUserId),
        [providedUserId]
    );

    /*
     * The authenticated session is cookie-based in the current application.
     * Therefore the access token/userId may not be present in localStorage.
     * Resolve the authoritative user id from /Auth/me as a fallback so
     * owner-only actions work consistently for posts and comments.
     */
    const { data: authenticatedUser } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const currentUser = useMemo<StoredCurrentUser>(() => {
        if (storedUser.id) {
            return storedUser;
        }

        if (authenticatedUser?.userId) {
            return {
                ...storedUser,
                id: authenticatedUser.userId.trim(),
            };
        }

        return storedUser;
    }, [storedUser, authenticatedUser?.userId]);

    return useMemo(
        () => ({
            ...currentUser,
            owns: (entity) => isOwnedByCurrentUser(currentUser, entity),
        }),
        [currentUser]
    );
}
