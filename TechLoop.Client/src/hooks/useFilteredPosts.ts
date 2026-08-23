import { useMemo } from "react";
import type { CommunityPost } from "../types/community.types";

export function useFilteredPosts(
    posts: CommunityPost[],
    search: string,
    selectedTechnologyId: number | null
): CommunityPost[] {
    return useMemo(() => {
        const query = search.trim().toLowerCase();

        return posts.filter((post) => {
            const matchesTechnology =
                selectedTechnologyId === null || post.technologyId === selectedTechnologyId;

            if (!matchesTechnology) {
                return false;
            }

            if (!query) {
                return true;
            }

            return (
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                (post.technologyName ?? "").toLowerCase().includes(query) ||
                post.userName.toLowerCase().includes(query)
            );
        });
    }, [posts, search, selectedTechnologyId]);
}
