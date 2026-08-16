import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createDiscussionComment, deleteDiscussionComment, getDiscussionComments, updateDiscussionComment } from "../../../../../api/discussion.api.ts";
import type { DiscussionComment } from "../../../../../types/discussion.types.ts";
import DiscussionCommentList from "./DiscussionCommentList";

interface DiscussionCommentsSectionProps {
    discussionId: number;
    currentUserId?: string;
}

export default function DiscussionCommentsSection({
                                                      discussionId,
                                                      currentUserId,
                                                  }: DiscussionCommentsSectionProps) {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        data: comments = [],
        isLoading: loading,
        isError,
    } = useQuery<DiscussionComment[]>({
        queryKey: ["discussion-comments", discussionId],
        queryFn: () => getDiscussionComments(discussionId),
        enabled: discussionId > 0,
    });

    const queryError = isError ? "Failed to load comments." : null;

    const displayError = error || queryError;
    async function refreshComments() {
        await queryClient.invalidateQueries({
            queryKey: ["discussion-comments", discussionId],
        });
    }

    async function handleCreateComment() {
        const trimmedContent = content.trim();
        if (!trimmedContent || submitting) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await createDiscussionComment(
                discussionId,
                {
                    content: trimmedContent,
                    parentCommentId: null,
                }
            );

            setContent("");

            await refreshComments();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to create comment.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReply(
        parentComment: DiscussionComment,
        replyContent: string
    ) {
        const trimmedContent = replyContent.trim();

        if (!trimmedContent) {
            throw new Error("Reply cannot be empty.");
        }

        try {
            setError(null);

            await createDiscussionComment(
                discussionId,
                {
                    content: trimmedContent,
                    parentCommentId:
                    parentComment.id,
                }
            );

            await refreshComments();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to create reply.";
            setError(message);
            throw err;
        }
    }

    async function handleEdit(
        comment: DiscussionComment,
        newContent: string
    ) {
        const trimmedContent = newContent.trim();
        if (!trimmedContent) {
            throw new Error("Comment cannot be empty.");
        }

        try {
            setError(null);

            await updateDiscussionComment(
                comment.id,
                {
                    content: trimmedContent,
                }
            );

            await refreshComments();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to update comment.";

            setError(message);
            throw err;
        }
    }

    async function handleDelete(commentId: number) {
        try {
            setError(null);
            await deleteDiscussionComment(commentId);
            await refreshComments();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to delete comment.";

            setError(message);

            throw err;
        }
    }

    const commentCount = comments.length;

    return (
        <div className="mt-5 border-t border-[#223A59] pt-4">

            {/* Comments Header */}
            <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-[#00E8C2]" />

                <h3 className="text-xs font-semibold text-white">
                    Comments
                </h3>

                {!loading && (
                    <span className="text-[10px] text-[#5C7394]">
                        {commentCount}
                    </span>
                )}
            </div>

            <p className="mt-1 text-[10px] text-[#8CA3BF]">
                Join the discussion.
            </p>

            {/* Error */}
            {displayError && (
                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                    <p className="text-[10px] text-red-300">
                        {displayError}
                    </p>
                </div>
            )}

            {/* Create Comment */}
            <div className="mt-4">

                <textarea
                    value={content} onChange={(event) => setContent(event.target.value)}
                    rows={3} maxLength={1000} disabled={submitting} placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-[#223A59] bg-[#0E192A] px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-[#5C7394] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25 disabled:opacity-50"
                />

                <div className="mt-1.5 flex items-center justify-between">

                    <span className="text-[9px] text-[#5C7394]">
                        {content.length}/1000
                    </span>

                    <button type="button" onClick={() => void handleCreateComment()}
                            disabled={submitting || !content.trim()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#00E8C2] px-3 py-2 text-[10px] font-semibold text-[#081423] transition hover:bg-[#00DDB9] disabled:cursor-not-allowed disabled:opacity-50">
                        <Send size={12} />

                        {submitting ? "Commenting..." : "Comment"}
                    </button>

                </div>
            </div>

            {/* Comments List */}
            <div className="mt-4">

                {loading ? (
                    <div className="space-y-2">
                        <div className="h-20 animate-pulse rounded-xl bg-[#101C30]" />
                        <div className="h-16 animate-pulse rounded-xl bg-[#101C30]" />
                    </div>
                ) : (
                    <DiscussionCommentList
                        comments={comments}
                        currentUserId={currentUserId}
                        onReply={handleReply}
                        onEdit={handleEdit}
                        onDelete={handleDelete} />
                )}

            </div>

        </div>
    );
}