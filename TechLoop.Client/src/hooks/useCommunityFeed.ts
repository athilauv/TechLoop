import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
    getCommunityFeed,
    getPostLikeStatus,
    getSavedCommunityPosts
} from "../api/mentorCommunity.api.ts";
import { getTechnologies } from "../api/technology.api.ts";
import type { CommunityRole } from "../types/community.types";
import { communityQueryKeys } from "./queryKeys";

export function useCommunityFeed(role: CommunityRole) {
    const feedQuery = useQuery({
        queryKey: communityQueryKeys.feed(role),
        queryFn: () => getCommunityFeed(role),
    });

    const savedQuery = useQuery({
        queryKey: communityQueryKeys.savedPosts(role),
        queryFn: () => getSavedCommunityPosts(role),
    });

    const technologiesQuery = useQuery({
        queryKey: communityQueryKeys.technologies(),
        queryFn: () => getTechnologies(),
        staleTime: 5 * 60 * 1000,
    });

    const posts = feedQuery.data ?? [];

    // NOTE: the backend has no bulk "like status for these post IDs"
    // endpoint today, only a per-post one (GET .../likes/me). This mirrors
    // the N+1 pattern that already existed in both CommunityPage and
    // MentorCommunityPage — React Query at least caches each post's like
    // status individually now instead of re-fetching all of them on every
    // page load. If a bulk endpoint gets added later, this is the only
    // place that needs to change.
    const likeStatusQueries = useQueries({
        queries: posts.map((post) => ({
            queryKey: communityQueryKeys.likeStatus(role, post.id),
            queryFn: () => getPostLikeStatus(role, post.id),
            enabled: feedQuery.isSuccess,
        })),
    });

    const likedPostIds = useMemo(
        () =>
            posts
                .filter((_, index) => likeStatusQueries[index]?.data === true)
                .map((post) => post.id),
        [posts, likeStatusQueries]
    );

    const savedPostIds = useMemo(
        () => (savedQuery.data ?? []).map((item) => item.postId),
        [savedQuery.data]
    );

    return {
        posts,
        likedPostIds,
        savedPostIds,
        technologies: technologiesQuery.data ?? [],
        isLoading: feedQuery.isLoading || savedQuery.isLoading,
        isLoadingTechnologies: technologiesQuery.isLoading,
        error: feedQuery.error ?? savedQuery.error ?? null,
        refetchFeed: feedQuery.refetch,
        refetchSaved: savedQuery.refetch,
    };
}
