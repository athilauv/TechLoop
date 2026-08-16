import {Bookmark, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    createPost,
    deletePost,
    getCommunityFeed,
    getLikeStatus,
    getSavedPosts,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from "../../../../api/community.api";
import {getTechnologies } from "../../../../api/technology.api";
import type { CommunityPost } from "../../../../types/community.types";
import CommunityPostList from "../components/CommunityPostList";
import CreatePostForm from "../components/CreatePostForm";

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [savedPosts, setSavedPosts] = useState<number[]>([]);
    const [technologies, setTechnologies] = useState<
            {
                id: number;
                name: string;
            }[]
        >([]);

    const [search, setSearch] = useState("");

    const [selectedTechnologyId, setSelectedTechnologyId,] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingTechnologies, setLoadingTechnologies,] = useState(true);
    const [creatingPost, setCreatingPost] = useState(false);
    const [createModalOpen, setCreateModalOpen,] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = localStorage.getItem("userId") ?? undefined;


    useEffect(() => {
        let cancelled = false;

        async function loadCommunity() {
            try {
                setLoading(true);
                setError(null);

                const [feed, saved,] = await Promise.all([getCommunityFeed(), getSavedPosts(),]);

                if (cancelled) {
                    return;
                }

                setPosts(feed);
                setSavedPosts(saved.map((item) => item.postId));

                const likeResults = await Promise.all(feed.map(
                            async (post) => {
                                try {
                                    const liked = await getLikeStatus(post.id);
                                    return liked ? post.id : null;
                                } catch {
                                    return null;
                                }
                            }
                        )
                    );

                if (!cancelled) {
                    setLikedPosts(likeResults.filter((id): id is number => id !== null));
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load community.");
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


    useEffect(() => {
        let cancelled = false;

        async function loadTechnologies() {
            try {
                setLoadingTechnologies(true);
                const result = await getTechnologies();

                if (cancelled) {
                    return;
                }

                setTechnologies(result.map(
                        (technology) => ({id: technology.id, name: technology.name,})
                    )
                );
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Unable to load technologies.");
                }
            } finally {
                if (!cancelled) {
                    setLoadingTechnologies(
                        false
                    );
                }
            }
        }

        void loadTechnologies();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredPosts = useMemo(() => {
            const query = search.trim().toLowerCase();
            return posts.filter(
                (post) => {
                    const matchesTechnology = selectedTechnologyId === null || post.technologyId === selectedTechnologyId;

                    if (
                        !matchesTechnology
                    ) {
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
                }
            );
        }, [posts, search, selectedTechnologyId]);

    async function handleLike(postId: number) {
        const isLiked = likedPosts.includes(postId);

        try {
            setError(null);

            if (isLiked) {
                await unlikePost(postId);
                setLikedPosts((current) => current.filter((id) => id !== postId));
                setPosts((current) =>
                        current.map((post) => post.id === postId ? {...post, likeCount: Math.max(0, post.likeCount - 1),} : post));
            } else {
                await likePost(postId);
                setLikedPosts((current) => [...current, postId,]);
                setPosts((current) => current.map((post) =>
                    post.id === postId ? {...post, likeCount: post.likeCount + 1,} : post));
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update like.");
        }
    }

    async function handleSave(postId: number) {
        const isSaved = savedPosts.includes(postId);

        try {
            setError(null);
            if (isSaved) {
                await unsavePost(postId);
                setSavedPosts((current) => current.filter((id) => id !== postId));
            }
            else {
                await savePost(postId);
                setSavedPosts((current) => [...current, postId,]);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update saved post.");
        }
    }

    async function handleCreatePost(
        technologyId: number | null,
        title: string,
        content: string
    ) {
        try {
            setCreatingPost(true);
            setError(null);
            const created = await createPost({technologyId, title, content,});
            setPosts((current) => [created, ...current,]);
            setCreateModalOpen(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to create discussion.");
            throw err;
        } finally {
            setCreatingPost(false);
        }
    }

    async function handleEditPost(
        postId: number,
        technologyId: number,
        title: string,
        content: string
    ) {
        try {
            setError(null);

            const updated = await updatePost(postId,
                    {technologyId, title, content,}
                );

            setPosts((current) => current.map((post) => post.id === postId ? updated : post));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update post.");
            throw err;
        }
    }

    async function handleDeletePost(
        postId: number
    ) {
        try {
            setError(null);
            await deletePost(postId);
            setPosts((current) => current.filter((post) => post.id !== postId));
            setSavedPosts((current) => current.filter((id) => id !== postId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to delete post.");
            throw err;
        }
    }

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-48 rounded bg-[#14253d]" />
                        <div className="h-11 rounded-xl bg-[#14253d]" />
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

                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                            Community
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold text-white">
                            Learn together
                        </h1>

                        <p className="mt-2 text-sm text-[#7189a8]">
                            Share knowledge, ask questions,
                            and learn from other developers.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* SAVED POSTS */}
                        <button type="button" onClick={() => window.location.href = "/learner/community/saved-posts"}
                            className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-[#7189a8] transition hover:text-white"
                            aria-label="Open saved posts">
                            <Bookmark size={15} className="text-[#17D4C3] transition group-hover:scale-105"/>
                            <span className="hidden sm:inline">
                                Saved
                            </span>
                        </button>

                        {/* CREATE DISCUSSION */}

                        <button type="button" onClick={() => setCreateModalOpen(true)}
                            className="group inline-flex items-center gap-2 rounded-xl border border-[#17D4C3]/40 bg-[#0b2736] px-3.5 py-2.5 text-xs font-semibold text-[#17D4C3] transition hover:border-[#17D4C3] hover:bg-[#103746]">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#17D4C3] text-[#06141f] transition group-hover:rotate-90">
                                <Plus size={13} />
                            </span>

                            <span>
                                Create discussion
                            </span>
                        </button>

                    </div>
                </div>

                {/* SEARCH */}

                <div className="relative mt-6">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526d8e]"/>

                    <input type="text" value={search} onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search discussions, technologies, topics..."
                        className="h-11 w-full rounded-xl border border-[#1e3254] bg-[#0f1e35] pl-10 pr-10 text-sm text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"/>

                    {search && (
                        <button type="button" onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#526d8e] hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* TECHNOLOGY FILTER */}

                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                    <button type="button" onClick={() => setSelectedTechnologyId(null)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                            selectedTechnologyId === null ? "border-[#17D4C3] bg-[#0a2638] text-[#17D4C3]" : "border-[#1e3254] bg-[#0f1e35] text-[#7189a8] hover:border-[#24506a] hover:text-white"}`}>
                        All discussions
                    </button>

                    {technologies.map(
                        (technology) => (
                            <button key={technology.id} type="button" onClick={() => setSelectedTechnologyId(technology.id)}
                                className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                                    selectedTechnologyId === technology.id ? "border-[#17D4C3] bg-[#0a2638] text-[#17D4C3]" : "border-[#1e3254] bg-[#0f1e35] text-[#7189a8] hover:border-[#24506a] hover:text-white"}`}>
                                {technology.name}
                            </button>
                        )
                    )}
                </div>

                {/* ERROR */}

                {error && (
                    <div className="mt-5 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3 text-xs text-[#ef8b8b]">
                        {error}
                    </div>
                )}

                {/* POSTS */}
                <div className="mt-6">
                    <CommunityPostList
                        posts={filteredPosts}
                        likedPosts={likedPosts}
                        savedPosts={savedPosts}
                        currentUserId={currentUserId}
                        onLike={handleLike}
                        onSave={handleSave}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}/>
                </div>
            </div>

            {/* CREATE MODAL */}

            {createModalOpen && (
                <CreatePostForm technologies={technologies}
                    loadingTechnologies={loadingTechnologies}
                    submitting={creatingPost}
                    onSubmit={handleCreatePost}
                    onClose={() => setCreateModalOpen(false)}
                />
            )}
        </div>
    );
}