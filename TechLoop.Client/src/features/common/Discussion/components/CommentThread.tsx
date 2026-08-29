import { useEffect, useRef, useState } from "react";
import { Check, MoreVertical, Pencil, Reply, Trash2, X } from "lucide-react";
import type { DiscussionComment } from "../../../../types/discussion.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import { showToast } from "../../../../utils/toast.tsx";
import UserAvatar from "./UserAvatar.tsx";
import CommentComposer from "./CommentComposer.tsx";
import MentorBadge from "../../community/components/shared/MentorBadge.tsx";
import { isMentor } from "../../../../utils/isMentor.ts";


interface CommentThreadProps {
    comments: DiscussionComment[];
    currentUserId?: string | null;
    readOnly?: boolean;
    onReply?: (comment: DiscussionComment, content: string) => Promise<void>;
    onEdit?: (comment: DiscussionComment, content: string) => Promise<void>;
    onDelete?: (comment: DiscussionComment) => Promise<void>;
}

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
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replying, setReplying] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isSameUser = (currentUserId?: string | null, authorId?: string | null,) => {
        if (!currentUserId || !authorId) return false;
        return currentUserId.trim().toLowerCase() === authorId.trim().toLowerCase();
    };
    const isOwner = !readOnly && isSameUser(currentUserId, comment.userId);
    const canEdit = isOwner && Boolean(onEdit);
    const canDelete = isOwner && Boolean(onDelete);

    const replies = allComments.filter((item) => item.parentCommentId === comment.id);

    useEffect(() => {
        if (!menuOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    const handleDelete = () => {
        if (!onDelete || deleting) return;

        showToast.confirm(
            "Delete Comment",
            "Are you sure you want to delete this comment? This action cannot be undone.",
            () => void performDelete(),
            undefined,
            "Delete",
        );
    };

    const performDelete = async () => {
        if (!onDelete) return;

        try {
            setDeleting(true);
            await onDelete(comment);
            setMenuOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = async () => {
        if (!onEdit || !editContent.trim()) return;

        await onEdit(comment, editContent.trim());
        setEditing(false);
        setMenuOpen(false);
    };

    const handleReply = async (content: string) => {
        if (!onReply) return;

        await onReply(comment, content);
        setReplying(false);
    };

    return (
        <div className={depth > 0 ? "mt-4 border-l border-[var(--cs-border)]/50 pl-4 sm:pl-5" : ""}>
            <div className="group flex gap-3">
                <UserAvatar name={comment.userName} size="sm" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-sm font-semibold text-[var(--cs-text)]">
                                {comment.userName}
                            </span>
                            {isMentor(comment) && <MentorBadge />}
                            <span className="text-xs text-[var(--cs-text-muted)]">
                                {formatRelativeTime(comment.createdAt)}
                            </span>
                        </div>

                        {isOwner && (canEdit || canDelete) && (
                            <div ref={menuRef} className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((current) => !current)}
                                    disabled={deleting}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--cs-text-muted)] opacity-0 transition-colors duration-150 group-hover:opacity-100 hover:bg-white/5 hover:text-[var(--cs-text)] focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Comment options"
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                >
                                    <MoreVertical size={15} />
                                </button>

                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-full z-50 mt-1.5 w-32 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-card,var(--cs-surface))] py-1 shadow-lg shadow-black/30"
                                    >
                                        {canEdit && (
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={() => {
                                                    setEditContent(comment.content);
                                                    setEditing(true);
                                                    setMenuOpen(false);
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--cs-text-secondary)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)]"
                                            >
                                                <Pencil size={13} />
                                                Edit
                                            </button>
                                        )}

                                        {canDelete && (
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={handleDelete}
                                                disabled={deleting}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--cs-danger)] transition-colors duration-150 hover:bg-[var(--cs-danger-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Trash2 size={13} />
                                                {deleting ? "Deleting..." : "Delete"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(event) => setEditContent(event.target.value)}
                                rows={3}
                                maxLength={1000}
                                autoFocus
                                className="w-full resize-none rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] px-3 py-2.5 text-sm leading-6 text-[var(--cs-text)] outline-none transition-colors duration-150 focus:border-[var(--cs-primary)] focus:ring-2 focus:ring-[var(--cs-primary)]/15"
                            />

                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditContent(comment.content);
                                        setEditing(false);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--cs-text-muted)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)]"
                                >
                                    <X size={12} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void handleEdit()}
                                    disabled={!editContent.trim()}
                                    className="inline-flex items-center gap-1 rounded-md bg-[var(--cs-primary)] px-2.5 py-1.5 text-xs font-semibold text-[var(--cs-primary-contrast)] transition-colors duration-150 hover:bg-[var(--cs-primary-hover,var(--cs-primary))] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Check size={12} />
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--cs-text-secondary)]">
                            {comment.content}
                        </p>
                    )}

                    {!readOnly && !editing && onReply && (
                        <div className="mt-1.5">
                            <button
                                type="button"
                                onClick={() => setReplying((current) => !current)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--cs-text-muted)] transition-colors duration-150 hover:text-[var(--cs-primary)]"
                            >
                                <Reply size={13} />
                                Reply
                            </button>

                            {replying && (
                                <div className="mt-2.5 max-w-lg">
                                    <CommentComposer
                                        placeholder="Write a reply..."
                                        submitLabel="Reply"
                                        submittingLabel="Replying..."
                                        autoFocus
                                        compact
                                        onCancel={() => setReplying(false)}
                                        onSubmit={handleReply}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
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

const CommentThread = ({
    comments,
    currentUserId,
    readOnly = false,
    onReply,
    onEdit,
    onDelete,
}: CommentThreadProps) => {
    const rootComments = comments.filter(
        (comment) => comment.parentCommentId === null || comment.parentCommentId === undefined,
    );

    if (comments.length === 0) {
        return (
            <p className="py-3 text-sm text-[var(--cs-text-muted)]">
                No comments yet — be the first to reply.
            </p>
        );
    }

    return (
        <div className="divide-y divide-[var(--cs-border)]/40">
            {rootComments.map((comment) => (
                <div key={comment.id} className="py-4 first:pt-0 last:pb-0">
                    <CommentRow
                        comment={comment}
                        allComments={comments}
                        currentUserId={currentUserId}
                        readOnly={readOnly}
                        onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        depth={0}
                    />
                </div>
            ))}
        </div>
    );
};

export default CommentThread;
