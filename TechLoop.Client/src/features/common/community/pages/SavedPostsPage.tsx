import { ArrowLeft, Bookmark } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { CommunityRole } from "../../../../types/community.types";
import { getCommunityFeed, getPostLikeStatus, getSavedCommunityPosts } from "../../../../api/mentorCommunity.api.ts";
import { communityQueryKeys } from "../../../../hooks/queryKeys.tsx";
import { usePostMutations } from "../../../../hooks/usePostMutations";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import PostList from "../components/feed/PostList";
import { getErrorMessage } from "../../../../utils/error.utils";

interface SavedPostsPageProps {
    role: CommunityRole;
    routeBase: string;
}

export default function SavedPostsPage({ role, routeBase }: SavedPostsPageProps) {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();

    const feedQuery = useQuery({
        queryKey: communityQueryKeys.feed(role),
        queryFn: () => getCommunityFeed(role),
    });

    const savedQuery = useQuery({
        queryKey: communityQueryKeys.savedPosts(role),
        queryFn: () => getSavedCommunityPosts(role),
    });

    const { toggleLike, toggleSave, updatePost, deletePost } = usePostMutations(role);

    const savedPosts = useMemo(() => {
        const savedIds = new Set((savedQuery.data ?? []).map((item) => item.postId));
        return (feedQuery.data ?? []).filter((post) => savedIds.has(post.id));
    }, [feedQuery.data, savedQuery.data]);

    const likeStatusQueries = useQueries({
        queries: savedPosts.map((post) => ({
            queryKey: communityQueryKeys.likeStatus(role, post.id),
            queryFn: () => getPostLikeStatus(role, post.id),
            enabled: savedQuery.isSuccess && feedQuery.isSuccess,
        })),
    });

    const likedPostIds = savedPosts
        .filter((_, index) => likeStatusQueries[index]?.data === true)
        .map((post) => post.id);

    const isLoading = feedQuery.isLoading || savedQuery.isLoading;
    const error = feedQuery.error ?? savedQuery.error;

    async function handleEdit(
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) {
        await updatePost(postId, { technologyId, title, content });
    }

    if (isLoading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-40 rounded bg-[#14253d]" />
                        <div className="h-48 rounded-2xl bg-[#0f1e35]" />
                        <div className="h-48 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-lg p-2 text-[#526d8e] transition hover:bg-[#0f1e35] hover:text-white"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                                Community
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold text-white">Saved posts</h1>
                        </div>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b2736]">
                        <Bookmark size={16} className="text-[#17D4C3]" />
                    </div>
                </div>

                <p className="mt-3 max-w-2xl text-sm text-[#7189a8]">
                    Posts you saved for later. Open a post or comments to continue the discussion.
                </p>

                {error && (
                    <div className="mt-5 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3 text-xs text-[#ef8b8b]">
                        {getErrorMessage(error, "Unable to load saved posts.")}
                    </div>
                )}

                {!error && savedPosts.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] px-6 py-14 text-center">
                        <Bookmark size={28} className="mx-auto text-[#526d8e]" />
                        <h2 className="mt-4 text-sm font-semibold text-white">No saved posts</h2>
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#526d8e]">
                            Save discussions from the community and they will appear here.
                        </p>
                    </div>
                )}

                {savedPosts.length > 0 && (
                    <div className="mt-7">
                        <PostList
                            posts={savedPosts}
                            role={role}
                            likedPostIds={likedPostIds}
                            savedPostIds={savedPosts.map((post) => post.id)}
                            currentUserId={currentUser.id}
                            commentsMode="navigate"
                            onLike={(postId) => toggleLike(postId, likedPostIds.includes(postId))}
                            onSave={(postId) => toggleSave(postId, true)}
                            onOpen={(postId) => navigate(`${routeBase}/post/${postId}`)}
                            onEdit={handleEdit}
                            onDelete={deletePost}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
