import { useState } from "react";
import { Check, MoreVertical, Pencil, Reply, Trash2, X } from "lucide-react";
import type { DiscussionComment } from "../../../../types/discussion.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import { isSameUser } from "../../../../hooks/useCurrentUserId.ts";
import UserAvatar from "./UserAvatar";
import CommentComposer from "./CommentComposer";

interface CommentThreadProps {
    comments: DiscussionComment[];
    currentUserId?: string | null;
    readOnly?: boolean;
    onReply?: (comment: DiscussionComment, content: string) => Promise<void>;
    onEdit?: (comment: DiscussionComment, content: string) => Promise<void>;
    onDelete?: (comment: DiscussionComment) => Promise<void>;
}

const CommentThread = ({
                           comments,
                           currentUserId,
                           readOnly = false,
                           onReply,
                           onEdit,
                           onDelete,
                       }: CommentThreadProps) => {
    const rootComments = comments.filter((comment) => comment.parentCommentId === null);

    if (comments.length === 0) {
        return (
            <p className="py-3 text-xs text-[var(--cs-text-muted)]">
                No comments yet{readOnly ? "." : " — be the first to reply."}
            </p>
        );
    }

    return (
        <div className="divide-y divide-[var(--cs-border)]/40">
            {rootComments.map((comment) => (
                <CommentRow
                    key={comment.id}
                    comment={comment}
                    allComments={comments}
                    currentUserId={currentUserId}
                    readOnly={readOnly}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    depth={0}
                />
            ))}
        </div>
    );
};

interface CommentRowProps {
    comment: DiscussionComment;
    allComments: DiscussionComment[];
    currentUserId?: string | null;
    readOnly: boolean;
    onReply?: (comment: DiscussionComment, content: string) => Promise<void>;
    onEdit?: (comment: DiscussionComment, content: string) => Promise<void>;
    onDelete?: (comment: DiscussionComment) => Promise<void>;
    depth: number;
}

const CommentRow = ({
                        comment,
                        allComments,
                        currentUserId,
                        readOnly,
                        onReply,
                        onEdit,
                        onDelete,
                        depth,
                    }: CommentRowProps) => {
    const replies = allComments.filter((item) => item.parentCommentId === comment.id);
    const isOwner = !readOnly && isSameUser(currentUserId, comment.userId);

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [replying, setReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = () => {
        if (!onDelete) return;
        setMenuOpen(false);

        void (async () => {
            setDeleting(true);
            try {
                await onDelete(comment);
            } finally {
                setDeleting(false);
            }
        })();
    };

    return (
        <div className={depth > 0 ? "ml-6 border-l border-[var(--cs-border)]/40 pl-4" : ""}>
            <div className="py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <UserAvatar name={comment.userName} size="sm" />

                        <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium text-[var(--cs-text)]">
                                {comment.userName}
                            </p>
                            <p className="text-[10px] text-[var(--cs-text-muted)]">
                                {formatRelativeTime(comment.createdAt)}
                            </p>
                        </div>
                    </div>

                    {isOwner && !editing && (onEdit || onDelete) && (
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((current) => !current)}
                                aria-label="Comment options"
                                className="rounded-md p-1.5 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)]"
                            >
                                <MoreVertical size={14} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-7 z-20 w-28 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-xl">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setEditing(true);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-[var(--cs-text-secondary)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)]"
                                        >
                                            <Pencil size={12} />
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteClick}
                                            disabled={deleting}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-[var(--cs-danger)] transition-colors hover:bg-[var(--cs-danger-subtle)] disabled:opacity-50"
                                        >
                                            <Trash2 size={12} />
                                            {deleting ? "Deleting..." : "Delete"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {editing ? (
                    <div className="mt-2 pl-9">
                        <textarea
                            value={editContent}
                            onChange={(event) => setEditContent(event.target.value)}
                            rows={2}
                            maxLength={1000}
                            className="w-full resize-none rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 px-3 py-2 text-xs text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                        />
                        <div className="mt-1.5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditContent(comment.content);
                                    setEditing(false);
                                }}
                                className="rounded-md px-2.5 py-1 text-[11px] text-[var(--cs-text-muted)] hover:text-[var(--cs-text)]"
                            >
                                <X size={11} className="mr-1 inline" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    void (async () => {
                                        if (!onEdit || !editContent.trim()) return;
                                        await onEdit(comment, editContent.trim());
                                        setEditing(false);
                                    })();
                                }}
                                disabled={!editContent.trim()}
                                className="rounded-md border border-[var(--cs-primary,#00C9A7)] bg-[var(--cs-primary,#00C9A7)] px-2.5 py-1 text-[11px] font-semibold text-[var(--cs-primary-contrast,#081423)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check size={11} className="mr-1 inline" />
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-1.5 whitespace-pre-wrap pl-9 text-xs leading-5 text-[var(--cs-text-secondary)]">
                        {comment.content}
                    </p>
                )}

                {!readOnly && !editing && onReply && (
                    <div className="mt-2 pl-9">
                        <button
                            type="button"
                            onClick={() => setReplying((current) => !current)}
                            className="inline-flex items-center gap-1 text-[11px] text-[var(--cs-text-muted)] transition-colors hover:text-[var(--cs-primary,#00C9A7)]"
                        >
                            <Reply size={12} />
                            Reply
                        </button>

                        {replying && (
                            <div className="mt-2">
                                <CommentComposer
                                    placeholder="Write a reply..."
                                    submitLabel="Reply"
                                    submittingLabel="Replying..."
                                    autoFocus
                                    compact
                                    onCancel={() => setReplying(false)}
                                    onSubmit={async (content) => {
                                        await onReply(comment, content);
                                        setReplying(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {replies.length > 0 && (
                <div>
                    {replies.map((reply) => (
                        <CommentRow
                            key={reply.id}
                            comment={reply}
                            allComments={allComments}
                            currentUserId={currentUserId}
                            readOnly={readOnly}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentThread;
