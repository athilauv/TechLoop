import type { CommunityRole } from "../types/community.types.ts";

export const communityQueryKeys = {
    feed: (role: CommunityRole) => ["community", role, "feed"] as const,
    post: (role: CommunityRole, postId: number) => ["community", role, "post", postId] as const,
    savedPosts: (role: CommunityRole) => ["community", role, "saved-posts"] as const,
    likeStatus: (role: CommunityRole, postId: number) =>
        ["community", role, "like-status", postId] as const,
    comments: (role: CommunityRole, postId: number) =>
        ["community", role, "comments", postId] as const,
    technologies: () => ["community", "technologies"] as const,
};
