import { useState } from "react";
import { Check, MoreVertical, Pencil, Reply, Trash2, X } from "lucide-react";
import type { DiscussionComment } from "../../../../../types/discussion.types.ts";
import { formatRelativeTime } from "../../../../../utils/formatRelativeTime.ts";

interface DiscussionCommentListProps {
    comments: DiscussionComment[];
    currentUserId?: string;
    onReply: (
        comment: DiscussionComment,
        content: string
    ) => Promise<void>;
    onEdit: (
        comment: DiscussionComment,
        content: string
    ) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
}

interface CommentItemProps {
    comment: DiscussionComment;
    replies: DiscussionComment[];
    currentUserId?: string;
    onReply: (
        comment: DiscussionComment,
        content: string
    ) => Promise<void>;
    onEdit: (
        comment: DiscussionComment,
        content: string
    ) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
    level: number;
}

export default function DiscussionCommentList({
                                                  comments,
                                                  currentUserId,
                                                  onReply,
                                                  onEdit,
                                                  onDelete,
                                              }: DiscussionCommentListProps) {
    const rootComments = comments.filter(comment => comment.parentCommentId === null);

    return (
        <div className="space-y-3">
            {rootComments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    replies={comments.filter(item => item.parentCommentId === comment.id)}
                    currentUserId={currentUserId}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    level={0}
                />
            ))}
        </div>
    );
}

function CommentItem({
                         comment,
                         replies,
                         currentUserId,
                         onReply,
                         onEdit,
                         onDelete,
                         level,
                     }: CommentItemProps) {
    const isOwner = !!currentUserId && currentUserId.trim().toLowerCase() === comment.userId.trim().toLowerCase();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [replying, setReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [replyingSaving, setReplyingSaving] = useState(false);

    const handleEdit = async () => {
        const trimmed = editContent.trim();

        if (!trimmed || saving) return;
        try {
            setSaving(true);
            await onEdit(comment, trimmed);
            setEditing(false);
            setMenuOpen(false);
        } finally {
            setSaving(false);
        }
    };

    const handleReply = async () => {
        const trimmed = replyContent.trim();

        if (!trimmed || replyingSaving) return;
        try {
            setReplyingSaving(true);
            await onReply(comment, trimmed);
            setReplyContent("");
            setReplying(false);
        } finally {
            setReplyingSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this comment?")) {
            setMenuOpen(false);
            return;
        }

        await onDelete(comment.id);
        setMenuOpen(false);
    };

    return (
        <div
            className={
                level > 0 ? "ml-8 border-l border-[#223A59] pl-4" : ""
            }>
            <div className="rounded-xl border border-[#223A59] bg-[#101C30] p-3">

                <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E8C2]/15 text-[10px] font-semibold text-[#00E8C2]">
                            {comment.userName?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold text-white">
                                {comment.userName}
                            </p>

                            <p className="text-[9px] text-[#5C7394]">
                                {formatRelativeTime(comment.createdAt)}
                            </p>
                        </div>
                    </div>

                    {isOwner && !editing && (
                        <div className="relative shrink-0">

                            <button
                                type="button"
                                onClick={() => setMenuOpen(current => !current)}
                                className="rounded-md p-1.5 text-[#5C7394] transition hover:bg-[#14243C] hover:text-white"
                                aria-label="Comment options">
                                <MoreVertical size={15} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-8 z-30 w-28 overflow-hidden rounded-lg border border-[#223A59] bg-[#0E192A] shadow-xl shadow-black/40">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setEditing(true);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] text-[#B9C8DC] transition hover:bg-white/5 hover:text-white">
                                        <Pencil size={12} />
                                        Edit
                                    </button>

                                    <button type="button"
                                            onClick={() => void handleDelete()}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] text-red-400 transition hover:bg-red-500/10">
                                        <Trash2 size={12} />
                                        Delete
                                    </button>

                                </div>
                            )}

                        </div>
                    )}

                </div>

                {editing ? (
                    <div className="mt-3">

                        <textarea
                            value={editContent}
                            onChange={event => setEditContent(event.target.value)}
                            rows={3}
                            maxLength={1000}
                            className="w-full resize-none rounded-lg border border-[#223A59] bg-[#0E192A] px-3 py-2 text-xs leading-5 text-white outline-none focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                        />

                        <div className="mt-2 flex justify-end gap-2">

                            <button type="button" onClick={() => {
                                setEditContent(comment.content);
                                setEditing(false);
                            }}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#223A59] px-2.5 py-1.5 text-[10px] text-[#8CA3BF] hover:text-white disabled:opacity-50">
                                <X size={11} />
                                Cancel
                            </button>

                            <button type="button" onClick={() => void handleEdit()} disabled={saving || !editContent.trim()}
                                    className="inline-flex items-center gap-1 rounded-md bg-[#00E8C2] px-2.5 py-1.5 text-[10px] font-semibold text-[#081423] disabled:opacity-50">
                                <Check size={11} />
                                {saving ? "Saving..." : "Save"}
                            </button>

                        </div>
                    </div>
                ) : (
                    <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-[#B9C8DC]">
                        {comment.content}
                    </p>
                )}

                {!editing && (
                    <div className="mt-3">

                        <button type="button" onClick={() => setReplying(current => !current)}
                                className="inline-flex items-center gap-1 text-[10px] text-[#5C7394] transition hover:text-[#00E8C2]">
                            <Reply size={12} />
                            Reply
                        </button>

                        {replying && (
                            <div className="mt-2">

                                <textarea value={replyContent}
                                          onChange={event => setReplyContent(event.target.value)}
                                          rows={2}
                                          maxLength={1000}
                                          placeholder="Write a reply..."
                                          className="w-full resize-none rounded-lg border border-[#223A59] bg-[#0E192A] px-3 py-2 text-xs text-white outline-none placeholder:text-[#5C7394] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/25"
                                />

                                <div className="mt-2 flex justify-end gap-2">

                                    <button type="button" onClick={() => {
                                        setReplyContent("");
                                        setReplying(false);
                                    }}
                                            className="rounded-md border border-[#223A59] px-2.5 py-1.5 text-[10px] text-[#8CA3BF] hover:text-white"
                                    >
                                        Cancel
                                    </button>

                                    <button type="button" onClick={() => void handleReply()}
                                            disabled={replyingSaving || !replyContent.trim()}
                                            className="rounded-md bg-[#00E8C2] px-2.5 py-1.5 text-[10px] font-semibold text-[#081423] disabled:opacity-50">
                                        {replyingSaving ? "Replying..." : "Reply"}
                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>

            {replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply}
                                     replies={commentsForReply(replies, reply.id)}
                                     currentUserId={currentUserId}
                                     onReply={onReply}
                                     onEdit={onEdit}
                                     onDelete={onDelete}
                                     level={level + 1}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

function commentsForReply(
    comments: DiscussionComment[],
    parentId: number
): DiscussionComment[] {
    return comments.filter(comment => comment.parentCommentId === parentId);
}