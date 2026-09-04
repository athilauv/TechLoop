import { useMemo } from "react";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { getCommunityFeed, getPostLikeStatus, getSavedCommunityPosts } from "../api/mentorCommunity.api.ts";
import { getTechnologies } from "../api/technology.api.ts";
import type { CommunityRole } from "../types/community.types";
import { communityQueryKeys } from "./queryKeys";

export function useCommunityFeed(role: CommunityRole, search = "", selectedTechnologyId: number | null = null) {
    const feedQuery = useInfiniteQuery({
        queryKey: [...communityQueryKeys.feed(role), search, selectedTechnologyId], initialPageParam: 1,
        queryFn: ({ pageParam }) => getCommunityFeed(role, pageParam, 20, search, selectedTechnologyId ?? undefined),
        getNextPageParam: (p) => p.hasNextPage ? p.page + 1 : undefined,
    });
    const savedQuery = useQuery({ queryKey: communityQueryKeys.savedPosts(role), queryFn: () => getSavedCommunityPosts(role) });
    const technologiesQuery = useQuery({ queryKey: communityQueryKeys.technologies(), queryFn: getTechnologies, staleTime: 5 * 60 * 1000 });
    const posts = feedQuery.data?.pages.flatMap(p => p.items) ?? [];
    const likeStatusQueries = useQueries({ queries: posts.map(post => ({ queryKey: communityQueryKeys.likeStatus(role, post.id), queryFn: () => getPostLikeStatus(role, post.id), enabled: feedQuery.isSuccess })) });
    const likedPostIds = useMemo(() => posts.filter((_,i)=>likeStatusQueries[i]?.data===true).map(p=>p.id), [posts,likeStatusQueries]);
    const savedPostIds = useMemo(() => (savedQuery.data??[]).map(x=>x.postId), [savedQuery.data]);
    return { posts, likedPostIds, savedPostIds, technologies: technologiesQuery.data??[], isLoading: feedQuery.isLoading||savedQuery.isLoading, isLoadingTechnologies: technologiesQuery.isLoading, error: feedQuery.error??savedQuery.error??null, hasNextPage: !!feedQuery.hasNextPage, isFetchingNextPage: feedQuery.isFetchingNextPage, fetchNextPage: feedQuery.fetchNextPage, refetchFeed: feedQuery.refetch, refetchSaved: savedQuery.refetch };
}
