import type { PostComment } from "../../../types/community.types";
import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: PostComment[];
    currentUserId?: string;
    onReply?: (comment: PostComment) => void;
    onEdit?: (comment: PostComment) => void;
    onDelete?: (commentId: number) => void;
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

    return (
        <div className="space-y-3">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}