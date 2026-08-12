import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getCommunityPost,
    getSavedPosts,
    unsavePost,
} from "../../../api/community.api";

import type {
    CommunityPost,
} from "../../../types/community.types";

import CommunityPostCard from "../components/CommunityPostCard";

export default function SavedPostsPage() {
    const navigate = useNavigate();

    const [posts, setPosts] =
        useState<CommunityPost[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSavedPosts() {
            try {
                const saved =
                    await getSavedPosts();

                if (cancelled) {
                    return;
                }

                if (saved.length === 0) {
                    setPosts([]);
                    setLoading(false);
                    return;
                }

                const results =
                    await Promise.all(
                        saved.map((item) =>
                            getCommunityPost(
                                item.postId
                            ).catch(() => null)
                        )
                    );

                if (cancelled) {
                    return;
                }

                const validPosts =
                    results.filter(
                        (
                            post
                        ): post is CommunityPost =>
                            post !== null
                    );

                setPosts(validPosts);
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load saved posts."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadSavedPosts();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleUnsave(
        postId: number
    ) {
        try {
            await unsavePost(postId);

            setPosts((current) =>
                current.filter(
                    (post) =>
                        post.id !== postId
                )
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to remove saved post."
            );
        }
    }

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-5 w-32 rounded bg-[#14253d]" />

                        <div className="h-8 w-52 rounded bg-[#14253d]" />

                        <div className="h-4 w-80 max-w-full rounded bg-[#14253d]" />

                        <div className="h-48 rounded-2xl bg-[#0f1e35]" />

                        <div className="h-48 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/community")
                        }
                        className="inline-flex items-center gap-2 text-sm text-[#7189a8] transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to community
                    </button>

                    <div className="mt-6 rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load saved posts
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
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/community")
                            }
                            className="inline-flex items-center gap-2 text-sm text-[#7189a8] transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to community
                        </button>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12324a] text-[#17D4C3]">
                                <Bookmark
                                    size={19}
                                    fill="currentColor"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                                    Community
                                </p>

                                <h1 className="mt-1 text-2xl font-semibold text-white">
                                    Saved posts
                                </h1>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-[#7189a8]">
                            Posts you've saved for later.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/community")
                        }
                        className="rounded-xl border border-[#29466d] px-4 py-2.5 text-xs font-medium text-[#8fa6c2] transition hover:bg-[#10283e] hover:text-white"
                    >
                        Community
                    </button>
                </div>

                {/* Inline error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3">
                        <p className="text-xs text-[#ef8b8b]">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {posts.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#10283e] text-[#17D4C3]">
                            <Bookmark size={21} />
                        </div>

                        <p className="mt-4 text-sm font-medium text-white">
                            No saved posts
                        </p>

                        <p className="mt-2 text-xs text-[#7189a8]">
                            Save useful community discussions and they'll appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/community")
                            }
                            className="mt-5 rounded-lg border border-[#24506a] px-4 py-2 text-xs font-medium text-[#17D4C3] transition hover:bg-[#10283e]"
                        >
                            Explore community
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative"
                            >
                                <CommunityPostCard
                                    post={post}
                                    liked={false}
                                    saved={true}
                                    onLike={() =>
                                        undefined
                                    }
                                    onSave={
                                        handleUnsave
                                    }
                                    onOpen={(id) =>
                                        navigate(
                                            `/community/posts/${id}`
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}