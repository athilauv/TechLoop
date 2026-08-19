import { useEffect, useMemo, useState } from "react";

import {
    createMentorPost,
    deleteMentorPost,
    getMentorCommunityFeed,
    getMentorLikeStatus,
    likeMentorPost,
    saveMentorPost,
    unlikeMentorPost,
    unsaveMentorPost,
    updateMentorPost,
} from "../../../../api/mentorCommunity.api.ts";

import { getTechnologies } from "../../../../api/technology.api.ts";

import type { CommunityPost } from "../../../../types/community.types.ts";
import type { LearnerTechnology } from "../../../../types/technology.types.ts";

import { showToast } from "../../../../utils/toast.tsx";

import MentorCommunityHeader from "../components/MentorCommunityHeader";
import MentorCommunityTechnologyFilter from "../components/MentorCommunityTechnologyFilter.tsx.tsx";
import MentorCommunityPostList from "../components/MentorCommunityPostList";
import MentorCreatePostForm from "../components/MentorCreatePostForm";

export default function MentorCommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [technologies, setTechnologies] = useState<LearnerTechnology[]>([]);

    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [savedPosts, setSavedPosts] = useState<number[]>([]);

    const [selectedTechnologyId, setSelectedTechnologyId] =
        useState<number | null>(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingTechnologies, setLoadingTechnologies] =
        useState(true);

    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const currentUserId =
        localStorage.getItem("userId") ?? undefined;

    useEffect(() => {
        const loadCommunity = async () => {
            try {
                setLoading(true);
                setError("");

                const [postData, technologyData] =
                    await Promise.all([
                        getMentorCommunityFeed(),
                        getTechnologies(),
                    ]);

                setPosts(postData);
                setTechnologies(technologyData);

                const likeStatuses = await Promise.all(
                    postData.map(async (post) => {
                        try {
                            const liked =
                                await getMentorLikeStatus(post.id);

                            return liked ? post.id : null;
                        } catch {
                            return null;
                        }
                    })
                );

                setLikedPosts(
                    likeStatuses.filter(
                        (id): id is number =>
                            id !== null
                    )
                );
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unable to load community.";

                setError(message);
                showToast.error(message);
            } finally {
                setLoading(false);
                setLoadingTechnologies(false);
            }
        };

        void loadCommunity();
    }, []);

    const filteredPosts = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return posts.filter((post) => {
            const matchesTechnology =
                selectedTechnologyId === null ||
                post.technologyId === selectedTechnologyId;

            const matchesSearch =
                !normalizedSearch ||
                post.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                post.content
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                post.userName
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                post.technologyName
                    ?.toLowerCase()
                    .includes(normalizedSearch);

            return (
                matchesTechnology &&
                matchesSearch
            );
        });
    }, [
        posts,
        search,
        selectedTechnologyId,
    ]);

    const handleLike = async (postId: number) => {
        try {
            const liked =
                likedPosts.includes(postId);

            if (liked) {
                await unlikeMentorPost(postId);

                setLikedPosts((current) =>
                    current.filter(
                        (id) => id !== postId
                    )
                );

                setPosts((current) =>
                    current.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                likeCount: Math.max(
                                    0,
                                    post.likeCount - 1
                                ),
                            }
                            : post
                    )
                );

                showToast.success("Post unliked.");
            } else {
                await likeMentorPost(postId);

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
                                    post.likeCount + 1,
                            }
                            : post
                    )
                );

                showToast.success("Post liked.");
            }
        } catch (err: unknown) {
            showToast.error(
                err instanceof Error
                    ? err.message
                    : "Unable to update like."
            );

            throw err;
        }
    };

    const handleSave = async (postId: number) => {
        try {
            const saved =
                savedPosts.includes(postId);

            if (saved) {
                await unsaveMentorPost(postId);

                setSavedPosts((current) =>
                    current.filter(
                        (id) => id !== postId
                    )
                );

                showToast.success(
                    "Post removed from saved posts."
                );
            } else {
                await saveMentorPost(postId);

                setSavedPosts((current) => [
                    ...current,
                    postId,
                ]);

                showToast.success(
                    "Post saved successfully."
                );
            }
        } catch (err: unknown) {
            showToast.error(
                err instanceof Error
                    ? err.message
                    : "Unable to update saved post."
            );

            throw err;
        }
    };

    const handleCreate = async (
        technologyId: number,
        title: string,
        content: string
    ) => {
        try {
            setSubmitting(true);

            const created =
                await createMentorPost({
                    technologyId,
                    title,
                    content,
                });

            setPosts((current) => [
                created,
                ...current,
            ]);

            setShowCreateForm(false);

            showToast.success(
                "Post created successfully."
            );
        } catch (err: unknown) {
            showToast.error(
                err instanceof Error
                    ? err.message
                    : "Unable to create post."
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) => {
        try {
            const updated =
                await updateMentorPost(
                    postId,
                    {
                        technologyId,
                        title,
                        content,
                    }
                );

            setPosts((current) =>
                current.map((post) =>
                    post.id === postId
                        ? updated
                        : post
                )
            );

            showToast.success(
                "Post updated successfully."
            );
        } catch (err: unknown) {
            showToast.error(
                err instanceof Error
                    ? err.message
                    : "Unable to update post."
            );

            throw err;
        }
    };

    const handleDelete = async (
        postId: number
    ) => {
        try {
            await deleteMentorPost(postId);

            setPosts((current) =>
                current.filter(
                    (post) => post.id !== postId
                )
            );

            showToast.success(
                "Post deleted successfully."
            );
        } catch (err: unknown) {
            showToast.error(
                err instanceof Error
                    ? err.message
                    : "Unable to delete post."
            );

            throw err;
        }
    };

    if (loading) {
        return (
            <div className="min-h-full bg-[#071426] p-5 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                    <div className="h-44 rounded-2xl bg-[#0B1B30]" />

                    <div className="h-10 rounded-lg bg-[#0B1B30]" />

                    <div className="h-48 rounded-2xl bg-[#0B1B30]" />

                    <div className="h-48 rounded-2xl bg-[#0B1B30]" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#071426] text-white">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

                <MentorCommunityHeader
                    search={search}
                    onSearchChange={setSearch}
                    onCreatePost={() =>
                        setShowCreateForm(true)
                    }
                />

                {error && (
                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                        {error}
                    </div>
                )}

                {/* Technology filter */}
                <div className="mt-7">
                    <MentorCommunityTechnologyFilter
                        technologies={technologies}
                        selectedTechnologyId={
                            selectedTechnologyId
                        }
                        onTechnologyChange={
                            setSelectedTechnologyId
                        }
                        loading={
                            loadingTechnologies
                        }
                    />
                </div>

                {/* Result count */}
                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-white">
                            Community posts
                        </h2>

                        <p className="mt-1 text-[11px] text-[#526d8e]">
                            {filteredPosts.length}{" "}
                            {filteredPosts.length === 1
                                ? "post"
                                : "posts"}{" "}
                            found
                        </p>
                    </div>

                    {selectedTechnologyId !== null && (
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedTechnologyId(
                                    null
                                )
                            }
                            className="text-xs text-[#17D4C3] hover:underline"
                        >
                            Clear filter
                        </button>
                    )}
                </div>

                <div className="mt-4">
                    <MentorCommunityPostList
                        posts={filteredPosts}
                        likedPosts={likedPosts}
                        savedPosts={savedPosts}
                        currentUserId={currentUserId}
                        onLike={handleLike}
                        onSave={handleSave}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {showCreateForm && (
                <MentorCreatePostForm
                    technologies={technologies}
                    loadingTechnologies={
                        loadingTechnologies
                    }
                    submitting={submitting}
                    onSubmit={handleCreate}
                    onClose={() =>
                        setShowCreateForm(false)
                    }
                />
            )}
        </div>
    );
}