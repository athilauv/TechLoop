import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api.ts";

export const useCurrentUserId = (): string | null => {
    const { data: currentUser } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    return currentUser?.userId ?? null;
};

export const isSameUser = (
    currentUserId?: string | null,
    authorId?: string | null,
): boolean => {
    if (!currentUserId || !authorId) {
        return false;
    }

    return currentUserId.trim().toLowerCase() === authorId.trim().toLowerCase();
};
