import { useEffect, useState } from "react";

import {
    getCommunityFeed,
    getLikeStatus,
    getSavedPosts,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
} from "../../../api/community.api";

import type { CommunityPost } from "../../../types/community.types";

import CommunityPostCard from "../components/CommunityPostCard";

export default function CommunityPage() {
    const [posts, setPosts] = useState<
        CommunityPost[]
    >([]);

    const [likedPosts, setLikedPosts] = useState<
        number[]
    >([]);

    const [savedPosts, setSavedPosts] = useState<
        number[]
    >([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<
        string | null
    >(null);

    /*
     * If your auth system stores userId differently,
     * change this line to match your auth storage.
     */
    const currentUserId =
        localStorage.getItem("userId") ||
        undefined;

    useEffect(() => {
        let cancelled = false;

        async function loadCommunity() {
            try {
                setLoading(true);
                setError(null);

                const [feed, saved] =
                    await Promise.all([
                        getCommunityFeed(),
                        getSavedPosts(),
                    ]);

                if (cancelled) {
                    return;
                }

                setPosts(feed);

                setSavedPosts(
                    saved.map(
                        (item) => item.postId
                    )
                );

                const likeResults =
                    await Promise.all(
                        feed.map(
                            async (post) => {
                                try {
                                    const liked =
                                        await getLikeStatus(
                                            post.id
                                        );

                                    return liked
                                        ? post.id
                                        : null;
                                } catch {
                                    return null;
                                }
                            }
                        )
                    );

                if (!cancelled) {
                    setLikedPosts(
                        likeResults.filter(
                            (
                                id
                            ): id is number =>
                                id !== null
                        )
                    );
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load community."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadCommunity();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleLike(postId: number) {
        const isLiked =
            likedPosts.includes(postId);

        try {
            setError(null);

            if (isLiked) {
                await unlikePost(postId);

                setLikedPosts((current) =>
                    current.filter(
                        (id) =>
                            id !== postId
                    )
                );

                setPosts((current) =>
                    current.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                likeCount:
                                    Math.max(
                                        0,
                                        post.likeCount -
                                        1
                                    ),
                            }
                            : post
                    )
                );
            } else {
                await likePost(postId);

                setLikedPosts((current) => [
                    ...current,
                    postId,
                ]);

                setPosts((current) =>
                    current.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                likeCount:
                                    post.likeCount +
                                    1,
                            }
                            : post
                    )
                );
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update like."
            );
        }
    }

    async function handleSave(postId: number) {
        const isSaved =
            savedPosts.includes(postId);

        try {
            setError(null);

            if (isSaved) {
                await unsavePost(postId);

                setSavedPosts((current) =>
                    current.filter(
                        (id) =>
                            id !== postId
                    )
                );
            } else {
                await savePost(postId);

                setSavedPosts((current) => [
                    ...current,
                    postId,
                ]);
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update saved post."
            );
        }
    }

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-48 rounded bg-[#14253d]" />

                        <div className="h-4 w-72 rounded bg-[#14253d]" />

                        <div className="h-52 rounded-2xl bg-[#0f1e35]" />

                        <div className="h-52 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load community
                        </p>

                        <p className="mt-2 text-xs text-[#a96d76]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-4xl px-5 py-8">
                {/* Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                            Community
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold text-white">
                            Learn together
                        </h1>

                        <p className="mt-2 text-sm text-[#7189a8]">
                            Share knowledge, ask
                            questions, and learn from
                            other developers.
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3 text-xs text-[#ef8b8b]">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {posts.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] p-12 text-center">
                        <p className="text-sm font-medium text-white">
                            No community posts yet.
                        </p>

                        <p className="mt-2 text-xs text-[#7189a8]">
                            Be the first learner to
                            start a discussion.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {posts.map((post) => (
                            <CommunityPostCard
                                key={post.id}
                                post={post}
                                liked={likedPosts.includes(
                                    post.id
                                )}
                                saved={savedPosts.includes(
                                    post.id
                                )}
                                currentUserId={
                                    currentUserId
                                }
                                onLike={
                                    handleLike
                                }
                                onSave={
                                    handleSave
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}