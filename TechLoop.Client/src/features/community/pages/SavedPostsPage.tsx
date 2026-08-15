import { ArrowLeft, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deletePost,
    getCommunityFeed,
    getLikeStatus,
    getSavedPosts,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from "../../../api/community.api";
import type { CommunityPost } from "../../../types/community.types";
import CommunityPostCard from "../components/CommunityPostCard";

export default function SavedPostsPage() {
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = useState<CommunityPost[]>([]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = localStorage.getItem("userId") ?? undefined;

    useEffect(() => {
        let cancelled = false;

        async function loadSavedPosts() {
            try {
                setLoading(true);
                setError(null);

                const [saved, feed] = await Promise.all([
                    getSavedPosts(),
                    getCommunityFeed(),
                ]);

                if (cancelled) return;

                const savedIds = new Set(saved.map((item) => item.postId));
                const filteredPosts = feed.filter((post) => savedIds.has(post.id));

                setSavedPosts(filteredPosts);

                const likeResults = await Promise.all(
                    filteredPosts.map(async (post) => {
                        try {
                            return (await getLikeStatus(post.id)) ? post.id : null;
                        } catch {
                            return null;
                        }
                    })
                );

                if (!cancelled) {
                    setLikedPosts(likeResults.filter((id): id is number => id !== null));
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unable to load saved posts.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadSavedPosts();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleLike(postId: number) {
        const liked = likedPosts.includes(postId);

        try {
            setError(null);

            if (liked) {
                await unlikePost(postId);
                setLikedPosts((current) => current.filter((id) => id !== postId));
                setSavedPosts((current) =>
                    current.map((post) => post.id === postId ? { ...post, likeCount: Math.max(0, post.likeCount - 1) } : post)
                );
            } else {
                await likePost(postId);
                setLikedPosts((current) => [...current, postId]);
                setSavedPosts((current) => current.map((post) => post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post));
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update like.");
        }
    }

    async function handleSave(postId: number) {
        const saved = savedPosts.some((post) => post.id === postId);

        try {
            setError(null);

            if (saved) {
                await unsavePost(postId);
                setSavedPosts((current) => current.filter((post) => post.id !== postId));
            } else {
                await savePost(postId);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update saved post.");
        }
    }

    async function handleEdit(
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) {
        try {
            setError(null);

            const updated = await updatePost(postId, {
                technologyId,
                title,
                content,
            });

            setSavedPosts((current) =>
                current.map((post) => (post.id === postId ? updated : post))
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update post.");
            throw err;
        }
    }

    async function handleDelete(postId: number) {
        try {
            setError(null);
            await deletePost(postId);
            setSavedPosts((current) => current.filter((post) => post.id !== postId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to delete post.");
            throw err;
        }
    }

    function handleOpen(postId: number) {
        navigate(`/learner/community/post/${postId}`);
    }

    if (loading) {
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
                            <h1 className="mt-1 text-2xl font-semibold text-white">
                                Saved posts
                            </h1>
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
                        {error}
                    </div>
                )}

                {!error && savedPosts.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] px-6 py-14 text-center">
                        <Bookmark size={28} className="mx-auto text-[#526d8e]" />

                        <h2 className="mt-4 text-sm font-semibold text-white">
                            No saved posts
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#526d8e]">
                            Save discussions from the community and they will appear here.
                        </p>
                    </div>
                )}

                {savedPosts.length > 0 && (
                    <div className="mt-7 space-y-6">
                        {savedPosts.map((post) => (
                            <CommunityPostCard
                                key={post.id}
                                post={post}
                                liked={likedPosts.includes(post.id)}
                                saved={true}
                                currentUserId={currentUserId}
                                onLike={handleLike}
                                onSave={handleSave}
                                onOpen={handleOpen}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}