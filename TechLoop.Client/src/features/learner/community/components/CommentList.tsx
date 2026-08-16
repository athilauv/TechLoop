import type {PostComment,} from "../../../../types/community.types";
import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: PostComment[];
    currentUserId?: string;
    onReply?: (comment: PostComment, content: string) => Promise<void>;
    onEdit?: (comment: PostComment, content: string) => Promise<void>;
    onDelete?: (commentId: number) => Promise<void>;
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
            <div className="rounded-xl border border-dashed border-[#1e3254] bg-[#081423] px-5 py-7 text-center">
                <p className="text-xs font-medium text-white">
                    No comments yet.
                </p>

                <p className="mt-1 text-[10px] text-[#526d8e]">
                    Be the first to join the discussion.
                </p>
            </div>
        );
    }

    const childrenMap = new Map<number | null, PostComment[]>();
    for (const comment of comments) {
        const parentId = comment.parentCommentId;
        const existing = childrenMap.get(parentId) ?? [];
        existing.push(comment);
        childrenMap.set(parentId, existing);
    }

    function renderComments(parentId: number | null,
        depth: number
    ): React.ReactNode {
        const children = childrenMap.get(parentId) ?? [];

        return children.map(
            (comment) => (
                <div key={comment.id} className="space-y-2">
                    <CommentItem comment={comment}
                        currentUserId={currentUserId}
                        depth={depth}
                        onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}/>

                    {renderComments(comment.id, depth + 1)}
                </div>
            )
        );
    }

    return (
        <div className="space-y-2">
            {renderComments(null, 0)}
        </div>
    );
}