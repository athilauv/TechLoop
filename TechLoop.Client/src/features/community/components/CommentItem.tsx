import {
    MessageCircle,
    Pencil,
    Trash2,
} from "lucide-react";

import type { PostComment } from "../../../types/community.types";

interface CommentItemProps {
    comment: PostComment;
    currentUserId?: string;
    onReply?: (comment: PostComment) => void;
    onEdit?: (comment: PostComment) => void;
    onDelete?: (commentId: number) => void;
}

export default function CommentItem({
                                        comment,
                                        currentUserId,
                                        onReply,
                                        onEdit,
                                        onDelete,
                                    }: CommentItemProps) {
    const isOwner =
        currentUserId &&
        currentUserId === comment.userId;

    return (
        <div className="rounded-xl border border-[#1e3254] bg-[#081423] p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-xs font-semibold text-[#06141f]">
                        {comment.userName
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                            {comment.userName}
                        </p>

                        <p className="text-[10px] text-[#526d8e]">
                            {new Date(
                                comment.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>
                </div>

                {isOwner && (
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                onEdit?.(comment)
                            }
                            className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white"
                            aria-label="Edit comment"
                        >
                            <Pencil size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onDelete?.(comment.id)
                            }
                            className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#24151b] hover:text-[#ef8b8b]"
                            aria-label="Delete comment"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#a8bad0]">
                {comment.content}
            </p>

            <div className="mt-3 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() =>
                        onReply?.(comment)
                    }
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#526d8e] transition hover:text-[#17D4C3]"
                >
                    <MessageCircle size={13} />

                    Reply
                </button>

                {comment.replyCount > 0 && (
                    <span className="text-[11px] text-[#526d8e]">
                        {comment.replyCount}{" "}
                        {comment.replyCount === 1
                            ? "reply"
                            : "replies"}
                    </span>
                )}
            </div>
        </div>
    );
}