import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import CommentList from "../components/CommentList";
import {
    createComment,
    deleteComment,
    getCommunityPost,
    getLikeStatus,
    getPostComments,
    getSavedPosts,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
} from "../../../api/community.api";
import type { CommunityPost, PostComment } from "../../../types/community.types";
import PostActions from "../components/PostActions";

export default function CommunityPostPage() {
    const { postId } =
        useParams<{ postId: string }>();

    const navigate = useNavigate();

    const [post, setPost] =
        useState<CommunityPost | null>(null);

    const [comments, setComments] =
        useState<PostComment[]>([]);

    const [liked, setLiked] =
        useState(false);

    const [saved, setSaved] =
        useState(false);

    const [commentText, setCommentText] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submittingComment, setSubmittingComment] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [commentError, setCommentError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            return;
        }

        const id = Number(postId);

        if (!Number.isInteger(id) || id <= 0) {
            return;
        }

        let cancelled = false;

        async function loadPost() {
            try {
                setLoading(true);
                setError(null);

                const [
                    postResult,
                    commentsResult,
                    likedResult,
                    savedResult,
                ] = await Promise.all([
                    getCommunityPost(id),
                    getPostComments(id),
                    getLikeStatus(id),
                    getSavedPosts(),
                ]);

                if (cancelled) {
                    return;
                }

                setPost(postResult);
                setComments(commentsResult);
                setLiked(likedResult);

                setSaved(
                    savedResult.some(
                        (item) =>
                            item.postId === id
                    )
                );
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load post."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadPost();

        return () => {
            cancelled = true;
        };
    }, [postId]);

    async function handleLike() {
        if (!post || actionLoading) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);

            if (liked) {
                await unlikePost(post.id);

                setLiked(false);

                setPost((current) =>
                    current
                        ? {
                            ...current,
                            likeCount: Math.max(
                                0,
                                current.likeCount - 1
                            ),
                        }
                        : current
                );
            } else {
                await likePost(post.id);

                setLiked(true);

                setPost((current) =>
                    current
                        ? {
                            ...current,
                            likeCount:
                                current.likeCount + 1,
                        }
                        : current
                );
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update like."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleSave() {
        if (!post || actionLoading) {
            return;
        }

        try {
            setActionLoading(true);
            setError(null);

            if (saved) {
                await unsavePost(post.id);
                setSaved(false);
            } else {
                await savePost(post.id);
                setSaved(true);
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update saved post."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleCommentSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!post) {
            return;
        }

        const content =
            commentText.trim();

        if (!content) {
            setCommentError(
                "Please enter a comment."
            );
            return;
        }

        try {
            setSubmittingComment(true);
            setCommentError(null);

            const newComment =
                await createComment(
                    post.id,
                    {
                        content,
                        parentCommentId: null,
                    }
                );

            setComments((current) => [
                ...current,
                newComment,
            ]);

            setPost((current) =>
                current
                    ? {
                        ...current,
                        commentCount:
                            current.commentCount + 1,
                    }
                    : current
            );

            setCommentText("");
        } catch (err: unknown) {
            setCommentError(
                err instanceof Error
                    ? err.message
                    : "Unable to add comment."
            );
        } finally {
            setSubmittingComment(false);
        }
    }

    async function handleDeleteComment(
        commentId: number
    ) {
        try {
            await deleteComment(commentId);

            setComments((current) =>
                current.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );

            setPost((current) =>
                current
                    ? {
                        ...current,
                        commentCount: Math.max(
                            0,
                            current.commentCount - 1
                        ),
                    }
                    : current
            );
        } catch (err: unknown) {
            setCommentError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete comment."
            );
        }
    }

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-5 w-32 rounded bg-[#14253d]" />

                        <div className="h-52 rounded-2xl bg-[#0f1e35]" />

                        <div className="h-40 rounded-2xl bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-4xl px-5 py-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/community")
                        }
                        className="mb-6 inline-flex items-center gap-2 text-sm text-[#7189a8] hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to community
                    </button>

                    <div className="rounded-2xl border border-[#5c3038] bg-[#24151b] p-6">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load post
                        </p>

                        <p className="mt-2 text-xs text-[#a96d76]">
                            {error ??
                                "Post not found."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

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

                {/* POST */}
                <article className="mt-6 rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-semibold text-[#06141f]">
                            {post.userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-white">
                                {post.userName}
                            </p>

                            <p className="text-xs text-[#7189a8]">
                                {new Date(
                                    post.createdAt
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {post.technologyName && (
                        <div className="mt-5 inline-flex rounded-full border border-[#24506a] bg-[#10283e] px-3 py-1 text-xs font-medium text-[#17D4C3]">
                            {post.technologyName}
                        </div>
                    )}

                    <h1 className="mt-4 text-2xl font-semibold text-white">
                        {post.title}
                    </h1>

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#a8bad0]">
                        {post.content}
                    </div>

                    <div className="mt-6">
                        <PostActions
                            liked={liked}
                            saved={saved}
                            likeCount={post.likeCount}
                            commentCount={
                                post.commentCount
                            }
                            onLike={handleLike}
                            onSave={handleSave}
                            onComment={() =>
                                document
                                    .getElementById(
                                        "comment-input"
                                    )
                                    ?.focus()
                            }
                            disabled={actionLoading}
                        />
                    </div>
                </article>

                {/* COMMENTS */}
                <section className="mt-6 rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Comments
                            </h2>

                            <p className="mt-1 text-xs text-[#7189a8]">
                                Join the discussion.
                            </p>
                        </div>

                        <span className="text-xs text-[#526d8e]">
                            {post.commentCount}
                        </span>
                    </div>

                    {/* ADD COMMENT */}
                    <form
                        onSubmit={
                            handleCommentSubmit
                        }
                        className="mt-5"
                    >
                        <textarea
                            id="comment-input"
                            value={commentText}
                            onChange={(event) =>
                                setCommentText(
                                    event.target.value
                                )
                            }
                            rows={4}
                            maxLength={1000}
                            disabled={
                                submittingComment
                            }
                            placeholder="Write a comment..."
                            className="w-full resize-none rounded-xl border border-[#29466d] bg-[#081423] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3] disabled:opacity-50"
                        />

                        {commentError && (
                            <p className="mt-2 text-xs text-[#ef8b8b]">
                                {commentError}
                            </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] text-[#526d8e]">
                                {commentText.length}/1000
                            </span>

                            <button
                                type="submit"
                                disabled={
                                    submittingComment ||
                                    !commentText.trim()
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send size={14} />

                                {submittingComment
                                    ? "Posting..."
                                    : "Comment"}
                            </button>
                        </div>
                    </form>

                    {/* COMMENT LIST */}
                    <div className="mt-6">
                        <CommentList
                            comments={comments}
                            onDelete={
                                handleDeleteComment
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}