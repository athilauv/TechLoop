import { useState, type ReactNode } from "react";
import {
    ChevronDown,
    Lock,
    MessageCircle,
    MoreVertical,
    Pencil,
    Pin,
    Trash2,
} from "lucide-react";
import type { Discussion, DiscussionComment } from "../../../../types/discussion.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import { isSameUser } from "../../../../hooks/useCurrentUserId.ts";
import { useDiscussionComments } from "../../../../hooks/useDiscussionComments.ts";
import UserAvatar from "./UserAvatar";
import DiscussionForm from "./DiscussionForm";
import CommentThread from "./CommentThread";
import CommentComposer from "./CommentComposer";

interface DiscussionListItemProps {
    discussion: Discussion;
    currentUserId?: string | null;
    expanded: boolean;
    onToggleExpand: () => void;

    // Comments — fetched internally once expanded. Only the Learner
    // page passes create/reply/edit/delete; Mentor omits them, which
    // renders the thread read-only.
    fetchComments: (discussionId: number) => Promise<DiscussionComment[]>;
    commentsReadOnly?: boolean;
    onCreateComment?: (content: string) => Promise<void>;
    onReplyComment?: (comment: DiscussionComment, content: string) => Promise<void>;
    onEditComment?: (comment: DiscussionComment, content: string) => Promise<void>;
    onDeleteComment?: (comment: DiscussionComment) => Promise<void>;

    // Discussion-level actions — omit to hide the capability entirely.
    onEditDiscussion?: (title: string, content: string) => Promise<void>;
    onDeleteDiscussion?: () => Promise<void>;

    // Extra action rendered next to the owner menu (e.g. Mentor's Pin toggle).
    extraAction?: ReactNode;

    // Extra context rendered in the meta line (e.g. Mentor's "Question #12").
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

    const { comments, isLoading: commentsLoading, invalidate } = useDiscussionComments({
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

    const handleDelete = () => {
        if (!onDeleteDiscussion) return;
        setMenuOpen(false);

        void (async () => {
            setDeleting(true);
            try {
                await onDeleteDiscussion();
            } finally {
                setDeleting(false);
            }
        })();
    };

    if (editing) {
        return (
            <div className="rounded-xl border border-[var(--cs-border)]/60 bg-[var(--cs-surface)]/50 p-4 backdrop-blur-sm">
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
        <div className="py-4">
            <div className="flex items-start gap-3">
                <UserAvatar name={discussion.userName} />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <button
                            type="button"
                            onClick={onToggleExpand}
                            className="min-w-0 flex-1 text-left"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                {discussion.isPinned && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                        <Pin size={10} />
                                        Pinned
                                    </span>
                                )}
                                {discussion.isLocked && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--cs-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--cs-text-muted)]">
                                        <Lock size={10} />
                                        Locked
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-1 truncate text-sm font-semibold text-[var(--cs-text)]">
                                {discussion.title}
                            </h3>

                            {!expanded && (
                                <p className="mt-1 truncate text-xs text-[var(--cs-text-muted)]">
                                    {discussion.content}
                                </p>
                            )}
                        </button>

                        <div className="flex shrink-0 items-center gap-1">
                            {extraAction}

                            {(canEdit || canDelete) && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen((current) => !current)}
                                        aria-label="Discussion options"
                                        className="rounded-lg p-1.5 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)]"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-2xl">
                                            {canEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setEditing(true);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-[var(--cs-text-secondary)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)]"
                                                >
                                                    <Pencil size={13} />
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    disabled={deleting}
                                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-[var(--cs-danger)] transition-colors hover:bg-[var(--cs-danger-subtle)] disabled:opacity-50"
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
                    </div>

                    {expanded && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                            {discussion.content}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--cs-text-muted)]">
                        <span className="font-medium text-[var(--cs-text-secondary)]">
                            {discussion.userName}
                        </span>
                        <span>{formatRelativeTime(discussion.createdAt)}</span>
                        {contextSlot}

                        <button
                            type="button"
                            onClick={onToggleExpand}
                            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--cs-primary,#00C9A7)]"
                        >
                            <MessageCircle size={12} />
                            {discussion.commentCount}{" "}
                            {discussion.commentCount === 1 ? "comment" : "comments"}
                            <ChevronDown
                                size={12}
                                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    {expanded && (
                        <div className="mt-3 rounded-lg border border-[var(--cs-border)]/50 bg-[var(--cs-surface)]/30 p-3 backdrop-blur-sm">
                            {commentsLoading ? (
                                <div className="space-y-2 py-1">
                                    <div className="h-10 animate-pulse rounded-lg bg-[var(--cs-surface-muted)]/50" />
                                    <div className="h-10 animate-pulse rounded-lg bg-[var(--cs-surface-muted)]/50" />
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

                                    {!commentsReadOnly && handleCreateComment && (
                                        discussion.isLocked ? (
                                            <p className="mt-3 border-t border-[var(--cs-border)]/40 pt-3 text-[11px] text-[var(--cs-text-muted)]">
                                                This discussion is locked — new comments are disabled.
                                            </p>
                                        ) : (
                                            <div className="mt-3 border-t border-[var(--cs-border)]/40 pt-3">
                                                <CommentComposer
                                                    placeholder="Write a comment..."
                                                    submitLabel="Comment"
                                                    submittingLabel="Posting..."
                                                    onSubmit={handleCreateComment}
                                                />
                                            </div>
                                        )
                                    )}
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
