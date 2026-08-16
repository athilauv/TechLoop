import {MessageCircle, Send,} from "lucide-react";
import { useState } from "react";
import {useQuery, useQueryClient,} from "@tanstack/react-query";
import {createDiscussionComment, deleteDiscussionComment, getDiscussionComments, updateDiscussionComment} from "../../../../../api/discussion.api.ts";
import type {DiscussionComment,} from "../../../../../types/discussion.types.ts";
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
        queryKey: ["discussion-comments", discussionId,],
        queryFn: () => getDiscussionComments(discussionId),
        enabled: discussionId > 0,
    });

    const queryError = isError ? "Failed to load comments." : null;

    const displayError = error || queryError;
    async function refreshComments() {
        await queryClient.invalidateQueries({
            queryKey: ["discussion-comments", discussionId,],
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
        <div className="mt-5 border-t border-[#1e3254] pt-4">

            {/* Comments Header */}
            <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-[#17D4C3]"/>

                <h3 className="text-xs font-semibold text-white">
                    Comments
                </h3>

                {!loading && (
                    <span className="text-[10px] text-[#526d8e]">
                        {commentCount}
                    </span>
                )}
            </div>

            <p className="mt-1 text-[10px] text-[#7189a8]">
                Join the discussion.
            </p>

            {/* Error */}
            {displayError && (
                <div className="mt-3 rounded-lg border border-[#5c3038] bg-[#24151b] px-3 py-2">
                    <p className="text-[10px] text-[#ef8b8b]">
                        {displayError}
                    </p>
                </div>
            )}

            {/* Create Comment */}
            <div className="mt-4">

                <textarea
                    value={content} onChange={(event) => setContent(event.target.value)}
                    rows={3} maxLength={1000} disabled={submitting} placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                />

                <div className="mt-1.5 flex items-center justify-between">

                    <span className="text-[9px] text-[#526d8e]">
                        {content.length}/1000
                    </span>

                    <button type="button" onClick={() => void handleCreateComment()}
                        disabled={submitting || !content.trim()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#17D4C3] px-3 py-2 text-[10px] font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50">
                        <Send size={12} />

                        {submitting ? "Commenting..." : "Comment"}
                    </button>

                </div>
            </div>

            {/* Comments List */}
            <div className="mt-4">

                {loading ? (
                    <div className="space-y-2">
                        <div className="h-20 animate-pulse rounded-xl bg-[#0f1e35]" />
                        <div className="h-16 animate-pulse rounded-xl bg-[#0f1e35]" />
                    </div>
                ) : (
                    <DiscussionCommentList
                        comments={comments}
                        currentUserId={currentUserId}
                        onReply={handleReply}
                        onEdit={handleEdit}
                        onDelete={handleDelete}/>
                )}

            </div>

        </div>
    );
}