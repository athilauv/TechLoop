import {
    MessageCircle,
    Pencil,
    Trash2,
    X,
    Check,
} from "lucide-react";
import { useState } from "react";

import type { PostComment } from "../../../types/community.types";

interface CommentItemProps {
    comment: PostComment;
    currentUserId?: string;
    depth?: number;

    onReply?: (
        comment: PostComment,
        content: string
    ) => Promise<void>;

    onEdit?: (
        comment: PostComment,
        content: string
    ) => Promise<void>;

    onDelete?: (
        commentId: number
    ) => Promise<void>;
}

export default function CommentItem({
                                        comment,
                                        currentUserId,
                                        depth = 0,
                                        onReply,
                                        onEdit,
                                        onDelete,
                                    }: CommentItemProps) {
    const isOwner =
        !!currentUserId &&
        currentUserId.toLowerCase() ===
        comment.userId.toLowerCase();

    const [isEditing, setIsEditing] =
        useState(false);

    const [editText, setEditText] =
        useState(comment.content);

    const [replyText, setReplyText] =
        useState("");

    const [showReplyBox, setShowReplyBox] =
        useState(false);

    const [submittingReply, setSubmittingReply] =
        useState(false);

    const [savingEdit, setSavingEdit] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleEdit() {
        const content = editText.trim();

        if (!content) {
            setError("Comment cannot be empty.");
            return;
        }

        if (
            content ===
            comment.content.trim()
        ) {
            setIsEditing(false);
            return;
        }

        try {
            setSavingEdit(true);
            setError(null);

            await onEdit?.(
                comment,
                content
            );

            setIsEditing(false);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update comment."
            );
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleReply() {
        const content = replyText.trim();

        if (!content) {
            setError("Reply cannot be empty.");
            return;
        }

        try {
            setSubmittingReply(true);
            setError(null);

            await onReply?.(
                comment,
                content
            );

            setReplyText("");
            setShowReplyBox(false);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to add reply."
            );
        } finally {
            setSubmittingReply(false);
        }
    }

    async function handleDelete() {
        if (deleting) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await onDelete?.(comment.id);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete comment."
            );
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div
            className="space-y-2"
            style={{
                marginLeft:
                    depth > 0
                        ? `${Math.min(depth, 3) * 24}px`
                        : undefined,
            }}
        >
            <div className="rounded-xl border border-[#1e3254] bg-[#081423] p-4">

                {/* HEADER */}
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

                    {/* OWNER ACTIONS */}
                    {isOwner &&
                        !isEditing && (
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditText(
                                            comment.content
                                        );

                                        setError(null);

                                        setIsEditing(
                                            true
                                        );

                                        setShowReplyBox(
                                            false
                                        );
                                    }}
                                    disabled={deleting}
                                    className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white disabled:opacity-50"
                                    aria-label="Edit comment"
                                >
                                    <Pencil
                                        size={14}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={deleting}
                                    className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#24151b] hover:text-[#ef8b8b] disabled:opacity-50"
                                    aria-label="Delete comment"
                                >
                                    <Trash2
                                        size={14}
                                    />
                                </button>
                            </div>
                        )}
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mt-3 rounded-lg border border-[#5c3038] bg-[#24151b] px-3 py-2 text-xs text-[#ef8b8b]">
                        {error}
                    </div>
                )}

                {/* EDIT MODE */}
                {isEditing ? (
                    <div className="mt-3">
                        <textarea
                            value={editText}
                            onChange={(event) =>
                                setEditText(
                                    event.target
                                        .value
                                )
                            }
                            rows={4}
                            maxLength={1000}
                            disabled={
                                savingEdit
                            }
                            autoFocus
                            className="w-full resize-none rounded-xl border border-[#24506a] bg-[#0f1e35] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                        />

                        <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditText(
                                        comment.content
                                    );

                                    setError(null);

                                    setIsEditing(
                                        false
                                    );
                                }}
                                disabled={
                                    savingEdit
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#7189a8] transition hover:bg-[#10283e] hover:text-white disabled:opacity-50"
                            >
                                <X size={13} />
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleEdit
                                }
                                disabled={
                                    savingEdit
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#17D4C3] px-3 py-2 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check size={13} />

                                {savingEdit
                                    ? "Saving..."
                                    : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* COMMENT CONTENT */}
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#a8bad0]">
                            {comment.content}
                        </p>

                        {/* ACTIONS */}
                        <div className="mt-3 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setError(null);

                                    setShowReplyBox(
                                        (current) =>
                                            !current
                                    );

                                    setIsEditing(
                                        false
                                    );
                                }}
                                className="inline-flex items-center gap-1.5 text-[11px] text-[#526d8e] transition hover:text-[#17D4C3]"
                            >
                                <MessageCircle
                                    size={13}
                                />

                                Reply
                            </button>

                            {comment.replyCount >
                                0 && (
                                    <span className="text-[11px] text-[#526d8e]">
                                    {
                                        comment.replyCount
                                    }{" "}
                                        {comment.replyCount ===
                                        1
                                            ? "reply"
                                            : "replies"}
                                </span>
                                )}
                        </div>

                        {/* REPLY BOX */}
                        {showReplyBox && (
                            <div className="mt-4 border-t border-[#1e3254] pt-4">
                                <textarea
                                    value={
                                        replyText
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setReplyText(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={3}
                                    maxLength={1000}
                                    disabled={
                                        submittingReply
                                    }
                                    autoFocus
                                    placeholder={`Reply to ${comment.userName}...`}
                                    className="w-full resize-none rounded-xl border border-[#1e3254] bg-[#0f1e35] px-3 py-3 text-sm text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                                />

                                <div className="mt-2 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReplyText(
                                                ""
                                            );

                                            setShowReplyBox(
                                                false
                                            );

                                            setError(
                                                null
                                            );
                                        }}
                                        disabled={
                                            submittingReply
                                        }
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-[#7189a8] transition hover:bg-[#10283e] hover:text-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleReply
                                        }
                                        disabled={
                                            submittingReply
                                        }
                                        className="rounded-lg bg-[#17D4C3] px-3 py-2 text-xs font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submittingReply
                                            ? "Replying..."
                                            : "Reply"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}