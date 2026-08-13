import type { PostComment } from "../../../types/community.types";
import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: PostComment[];
    currentUserId?: string;

    onReply?: (
        comment: PostComment,
        content: string
    ) => Promise<void>;

    onEdit?: (
        commentId: number,
        content: string
    ) => Promise<void>;

    onDelete?: (
        commentId: number
    ) => Promise<void>;
}

export default function CommentList({
                                        comments,
                                        currentUserId,
                                        onReply,
                                        onEdit,
                                        onDelete,
                                    }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-[#1e3254] bg-[#081423] p-8 text-center">
                <p className="text-sm text-[#7189a8]">
                    No comments yet.
                </p>

                <p className="mt-1 text-xs text-[#526d8e]">
                    Be the first to join the discussion.
                </p>
            </div>
        );
    }

    /*
     * Only top-level comments are rendered here.
     * Replies are rendered underneath their parent.
     */
    const topLevelComments = comments.filter(
        (comment) => comment.parentCommentId === null
    );

    const replies = comments.filter(
        (comment) => comment.parentCommentId !== null
    );

    return (
        <div className="space-y-3">
            {topLevelComments.map((comment) => {
                const childReplies = replies.filter(
                    (reply) =>
                        reply.parentCommentId ===
                        comment.id
                );

                return (
                    <div key={comment.id}>
                        <CommentItem
                            comment={comment}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onEdit={
                                onEdit
                                    ? (comment, content) => onEdit(comment.id, content)
                                    : undefined
                            }
                            onDelete={onDelete}
                        />

                        {childReplies.length > 0 && (
                            <div className="ml-6 mt-2 space-y-2 border-l border-[#173a55] pl-3">
                                {childReplies.map(
                                    (reply) => (
                                        <CommentItem
                                            key={reply.id}
                                            comment={reply}
                                            currentUserId={
                                                currentUserId
                                            }
                                            onReply={
                                                onReply
                                            }
                                            onEdit={
                                                onEdit
                                                    ? (comment, content) => onEdit(comment.id, content)
                                                    : undefined
                                            }
                                            onDelete={
                                                onDelete
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}