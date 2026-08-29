import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Lock, MessageCircle, MoreVertical, Pencil, Pin, Trash2 } from "lucide-react";
import type { Discussion, DiscussionComment } from "../../../../types/discussion.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import { useDiscussionComments } from "../../../../hooks/useDiscussionComments.ts";
import { isSameUser } from "../../../../hooks/useCurrentUserId.ts";
import { showToast } from "../../../../utils/toast.tsx";
import UserAvatar from "./UserAvatar.tsx";
import DiscussionForm from "./DiscussionForm.tsx";
import CommentThread from "./CommentThread.tsx";
import CommentComposer from "./CommentComposer.tsx";
import MentorBadge from "../../community/components/shared/MentorBadge.tsx";
import { isMentor } from "../../../../utils/isMentor.ts";


interface DiscussionListItemProps {
    discussion: Discussion;
    currentUserId?: string | null;
    expanded: boolean;
    onToggleExpand: () => void;

    fetchComments: (discussionId: number) => Promise<DiscussionComment[]>;

    commentsReadOnly?: boolean;

    onCreateComment?: (content: string) => Promise<void>;
    onReplyComment?: (comment: DiscussionComment, content: string) => Promise<void>;
    onEditComment?: (comment: DiscussionComment, content: string) => Promise<void>;
    onDeleteComment?: (comment: DiscussionComment) => Promise<void>;

    onEditDiscussion?: (title: string, content: string) => Promise<void>;
    onDeleteDiscussion?: () => Promise<void>;

    extraAction?: ReactNode;
    contextSlot?: ReactNode;
}

const DiscussionListItem = ({
    discussion,
    currentUserId,
    expanded,
    onToggleExpand,
    fetchComments,
    commentsReadOnly = false,
    onCreateComment,
    onReplyComment,
    onEditComment,
    onDeleteComment,
    onEditDiscussion,
    onDeleteDiscussion,
    extraAction,
    contextSlot,
}: DiscussionListItemProps) => {

    const isOwner = isSameUser(currentUserId, discussion.userId);
    const canEdit = isOwner && Boolean(onEditDiscussion) && !discussion.isLocked;
    const canDelete = isOwner && Boolean(onDeleteDiscussion);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const {
        comments,
        isLoading: commentsLoading,
        invalidate,
    } = useDiscussionComments({
        discussionId: discussion.id,
        enabled: expanded,
        fetchComments,
    });

    const handleCreateComment = onCreateComment
        ? async (content: string) => {
              await onCreateComment(content);
              await invalidate();
          }
        : undefined;

    const handleReplyComment = onReplyComment
        ? async (comment: DiscussionComment, content: string) => {
              await onReplyComment(comment, content);
              await invalidate();
          }
        : undefined;

    const handleEditComment = onEditComment
        ? async (comment: DiscussionComment, content: string) => {
              await onEditComment(comment, content);
              await invalidate();
          }
        : undefined;

    const handleDeleteComment = onDeleteComment
        ? async (comment: DiscussionComment) => {
              await onDeleteComment(comment);
              await invalidate();
          }
        : undefined;

    const handleDeleteDiscussion = () => {
        if (!onDeleteDiscussion || deleting) return;

        showToast.confirm(
            "Delete Discussion",
            "Are you sure you want to delete this discussion? This action cannot be undone.",
            () => void performDeleteDiscussion(),
            undefined,
            "Delete",
        );
    };

    const performDeleteDiscussion = async () => {
        if (!onDeleteDiscussion) return;

        try {
            setDeleting(true);
            await onDeleteDiscussion();
            setMenuOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    const handleEditDiscussion = () => {
        if (!onEditDiscussion) return;

        setMenuOpen(false);
        setEditing(true);
    };

    if (editing) {
        return (
            <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-card,var(--cs-surface))] p-5 sm:p-6">
                <h2 className="mb-3 text-sm font-semibold text-[var(--cs-text)]">Edit discussion</h2>
                <DiscussionForm
                    initialTitle={discussion.title}
                    initialContent={discussion.content}
                    submitLabel="Save Changes"
                    submittingLabel="Saving..."
                    onCancel={() => setEditing(false)}
                    onSubmit={async (title, content) => {
                        if (!onEditDiscussion) return;
                        await onEditDiscussion(title, content);
                        setEditing(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-card,var(--cs-surface))] p-5 transition-colors duration-150 hover:border-[var(--cs-border)]/90 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
                <UserAvatar name={discussion.userName} size="lg" />

                <div className="min-w-0 flex-1">
                    {/* Author + metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-[var(--cs-text)]">
                            {discussion.userName}
                        </span>
                        {isMentor(discussion) && <MentorBadge />}
                        <span className="text-[var(--cs-text-muted)]" aria-hidden>
                            ·
                        </span>
                        <span className="text-xs text-[var(--cs-text-muted)]">
                            {formatRelativeTime(discussion.createdAt)}
                        </span>

                        {discussion.isPinned && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                                <Pin size={11} />
                                Pinned
                            </span>
                        )}

                        {discussion.isLocked && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--cs-border)] px-2 py-0.5 text-[11px] font-medium text-[var(--cs-text-muted)]">
                                <Lock size={11} />
                                Locked
                            </span>
                        )}
                    </div>

                    {/* Title + content */}
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="mt-1.5 block w-full rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40"
                    >
                        <h3 className="text-lg font-bold leading-snug text-[var(--cs-text)] sm:text-xl">
                            {discussion.title}
                        </h3>

                        {!expanded && (
                            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--cs-text-secondary)]">
                                {discussion.content}
                            </p>
                        )}
                    </button>

                    {expanded && (
                        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--cs-text-secondary)]">
                            {discussion.content}
                        </p>
                    )}

                    {/* Action row */}
                    <div className="mt-3.5 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onToggleExpand}
                            className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-[var(--cs-text-muted)] transition-colors duration-150 hover:text-[var(--cs-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40"
                        >
                            <MessageCircle size={14} />
                            {discussion.commentCount}{" "}
                            {discussion.commentCount === 1 ? "comment" : "comments"}
                            <ChevronDown
                                size={13}
                                className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
                            />
                        </button>

                        {contextSlot && <span className="text-xs">{contextSlot}</span>}

                        <div className="ml-auto flex shrink-0 items-center gap-1">
                            {extraAction}

                            {isOwner && (canEdit || canDelete) && (
                                <div ref={menuRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen((current) => !current)}
                                        disabled={deleting}
                                        aria-label="Discussion options"
                                        aria-haspopup="menu"
                                        aria-expanded={menuOpen}
                                        className="rounded-md p-1.5 text-[var(--cs-text-muted)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {menuOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 top-9 z-50 w-40 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-card,var(--cs-surface))] py-1 shadow-lg shadow-black/30"
                                        >
                                            {canEdit && (
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={handleEditDiscussion}
                                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--cs-text-secondary)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)]"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </button>
                                            )}

                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={handleDeleteDiscussion}
                                                    disabled={deleting}
                                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--cs-danger)] transition-colors duration-150 hover:bg-[var(--cs-danger-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                    {deleting ? "Deleting..." : "Delete"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments — open, unboxed conversation */}
                    {expanded && (
                        <div className="mt-4 border-t border-[var(--cs-border)]/60 pt-4">
                            {commentsLoading ? (
                                <div className="space-y-3 py-1">
                                    <div className="h-10 animate-pulse rounded-lg bg-white/5" />
                                    <div className="h-10 animate-pulse rounded-lg bg-white/5" />
                                </div>
                            ) : (
                                <>
                                    <CommentThread
                                        comments={comments}
                                        currentUserId={currentUserId}
                                        readOnly={commentsReadOnly}
                                        onReply={handleReplyComment}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                    />

                                    {!commentsReadOnly &&
                                        handleCreateComment &&
                                        (discussion.isLocked ? (
                                            <p className="mt-4 border-t border-[var(--cs-border)]/40 pt-4 text-xs text-[var(--cs-text-muted)]">
                                                This discussion is locked — new comments are disabled.
                                            </p>
                                        ) : (
                                            <div className="mt-4 border-t border-[var(--cs-border)]/40 pt-4">
                                                <CommentComposer
                                                    placeholder="Write a comment..."
                                                    submitLabel="Comment"
                                                    submittingLabel="Posting..."
                                                    onSubmit={handleCreateComment}
                                                />
                                            </div>
                                        ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionListItem;
