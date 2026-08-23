import { useMemo } from "react";
import {
    getCurrentUserFromStorage,
    isOwnedByCurrentUser,
    type StoredCurrentUser,
} from "../utils/getCurrentUserFromStorage";

export interface UseCurrentUserResult extends StoredCurrentUser {

    owns: (entity: { userId?: string; userName?: string }) => boolean;
}

export function useCurrentUser(providedUserId?: string): UseCurrentUserResult {
    return useMemo(() => {
        const user = getCurrentUserFromStorage(providedUserId);

        return {
            ...user,
            owns: (entity) => isOwnedByCurrentUser(user, entity),
        };
    }, [providedUserId]);
}