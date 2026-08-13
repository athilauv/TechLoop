import { MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { createComment, deleteComment, getPostComments, updateComment } from "../../../api/community.api";
import type { PostComment } from "../../../types/community.types";
import CommentList from "./CommentList";

interface PostCommentsSectionProps {
    postId: number;
    currentUserId?: string;
}

export default function PostCommentsSection({
                                                postId,
                                                currentUserId,
                                            }: PostCommentsSectionProps) {
    const [comments, setComments] = useState<
        PostComment[]
    >([]);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState<
        string | null
    >(null);

    async function loadComments() {
        try {
            setLoading(true);
            setError(null);

            const result =
                await getPostComments(postId);

            setComments(result);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load comments."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadComments();
    }, [postId]);

    async function handleCreateComment() {
        const trimmedContent = content.trim();

        if (!trimmedContent || submitting) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const created = await createComment(
                postId,
                {
                    content: trimmedContent,
                    parentCommentId: null,
                }
            );

            setComments((current) => [
                ...current,
                created,
            ]);

            setContent("");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create comment."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReply(
        parentComment: PostComment,
        replyContent: string
    ) {
        try {
            setError(null);

            const created = await createComment(
                postId,
                {
                    content: replyContent,
                    parentCommentId:
                    parentComment.id,
                }
            );

            setComments((current) =>
                current.map((comment) =>
                    comment.id === parentComment.id
                        ? {
                            ...comment,
                            replyCount:
                                comment.replyCount + 1,
                        }
                        : comment
                )
            );

            setComments((current) => [
                ...current,
                created,
            ]);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to create reply.";

            setError(message);

            throw err;
        }
    }

    async function handleEdit(
        commentId: number,
        newContent: string
    ) {
        try {
            setError(null);

            const updated =
                await updateComment(commentId, {
                    content: newContent,
                });

            setComments((current) =>
                current.map((comment) =>
                    comment.id === commentId
                        ? updated
                        : comment
                )
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to update comment.";

            setError(message);

            throw err;
        }
    }

    async function handleDelete(
        commentId: number
    ) {
        try {
            setError(null);

            await deleteComment(commentId);

            const deletedComment =
                comments.find(
                    (comment) =>
                        comment.id === commentId
                );

            setComments((current) =>
                current
                    .filter(
                        (comment) =>
                            comment.id !== commentId
                    )
                    .map((comment) =>
                        comment.id ===
                        deletedComment?.parentCommentId
                            ? {
                                ...comment,
                                replyCount:
                                    Math.max(
                                        0,
                                        comment.replyCount -
                                        1
                                    ),
                            }
                            : comment
                    )
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to delete comment.";

            setError(message);

            throw err;
        }
    }

    return (
        <div className="mt-5 border-t border-[#1e3254] pt-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <MessageCircle
                            size={16}
                            className="text-[#17D4C3]"
                        />

                        <h3 className="text-sm font-semibold text-white">
                            Comments
                        </h3>

                        {!loading && (
                            <span className="text-xs text-[#526d8e]">
                                {comments.length}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-[#7189a8]">
                        Join the discussion.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 rounded-xl border border-[#5c3038] bg-[#24151b] px-4 py-3">
                    <p className="text-xs text-[#ef8b8b]">
                        {error}
                    </p>
                </div>
            )}

            {/* New comment */}
            <div className="mt-4">
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    rows={4}
                    maxLength={1000}
                    disabled={submitting}
                    placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-[#1e3254] bg-[#06111f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                />

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-[#526d8e]">
                        {content.length}/1000
                    </span>

                    <button
                        type="button"
                        onClick={handleCreateComment}
                        disabled={
                            submitting ||
                            !content.trim()
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#17D4C3] px-4 py-2.5 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={14} />

                        {submitting
                            ? "Commenting..."
                            : "Comment"}
                    </button>
                </div>
            </div>

            {/* Comments */}
            <div className="mt-5">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-28 animate-pulse rounded-xl bg-[#0f1e35]" />
                        <div className="h-28 animate-pulse rounded-xl bg-[#0f1e35]" />
                    </div>
                ) : (
                    <CommentList
                        comments={comments}
                        currentUserId={
                            currentUserId
                        }
                        onReply={handleReply}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}