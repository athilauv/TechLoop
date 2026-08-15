import {
    Check,
    MessageCircle,
    MoreVertical,
    Pencil,
    Send,
    Trash2,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    PostComment,
} from "../../../types/community.types";

import {
    formatRelativeTime,
} from "../../../utils/formatRelativeTime";

import {
    showToast,
} from "../../../utils/toast.ts";

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

/* =========================================================
   COMPONENT
========================================================= */

export default function CommentItem({
                                        comment,
                                        currentUserId,
                                        depth = 0,
                                        onReply,
                                        onEdit,
                                        onDelete,
                                    }: CommentItemProps) {
    /* =====================================================
       CURRENT USER
    ===================================================== */

    const storedUserId =
        localStorage
            .getItem("userId")
            ?.trim();

    const storedUsername =
        localStorage
            .getItem("username")
            ?.trim()
            .toLowerCase();

    const normalizedCurrentUserId =
        (
            currentUserId ||
            storedUserId ||
            ""
        )
            .trim()
            .toLowerCase();

    const normalizedCommentUserId =
        (
            comment.userId ||
            ""
        )
            .trim()
            .toLowerCase();

    const normalizedCommentUsername =
        (
            comment.userName ||
            ""
        )
            .trim()
            .toLowerCase();

    /*
     * Same ownership strategy as CommunityPostCard:
     *
     * 1. Prefer user ID
     * 2. Fall back to username
     *
     * Username is unique in the Users table.
     */

    const isOwner =
        (
            !!normalizedCurrentUserId &&
            !!normalizedCommentUserId &&
            normalizedCurrentUserId ===
            normalizedCommentUserId
        ) ||
        (
            !!storedUsername &&
            !!normalizedCommentUsername &&
            storedUsername ===
            normalizedCommentUsername
        );

    /* =====================================================
       STATE
    ===================================================== */

    const [
        isEditing,
        setIsEditing,
    ] = useState(false);

    const [
        editText,
        setEditText,
    ] = useState(
        comment.content
    );

    const [
        replyText,
        setReplyText,
    ] = useState("");

    const [
        showReplyBox,
        setShowReplyBox,
    ] = useState(false);

    const [
        submittingReply,
        setSubmittingReply,
    ] = useState(false);

    const [
        savingEdit,
        setSavingEdit,
    ] = useState(false);

    const [
        deleting,
        setDeleting,
    ] = useState(false);

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<
        string | null
    >(null);

    const menuRef =
        useRef<HTMLDivElement | null>(
            null
        );

    /* =====================================================
       KEEP EDIT TEXT IN SYNC
    ===================================================== */

    useEffect(() => {
        if (!isEditing) {
            setEditText(
                comment.content
            );
        }
    }, [
        comment.content,
        isEditing,
    ]);

    /* =====================================================
       CLOSE MENU OUTSIDE
    ===================================================== */

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        function handleOutsideClick(
            event: MouseEvent
        ) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [menuOpen]);

    /* =====================================================
       EDIT
    ===================================================== */

    async function handleEdit() {
        const content =
            editText.trim();

        if (!content) {
            showToast.error(
                "Comment cannot be empty."
            );

            return;
        }

        if (
            content ===
            comment.content.trim()
        ) {
            setIsEditing(false);
            setMenuOpen(false);

            return;
        }

        if (!onEdit) {
            showToast.error(
                "Comment update is not available."
            );

            return;
        }

        try {
            setSavingEdit(true);
            setError(null);

            await onEdit(
                comment,
                content
            );

            setIsEditing(false);
            setMenuOpen(false);

            showToast.success(
                "Comment updated successfully."
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to update comment.";

            setError(message);

            showToast.error(
                message
            );
        } finally {
            setSavingEdit(false);
        }
    }

    /* =====================================================
       REPLY
    ===================================================== */

    async function handleReply() {
        const content =
            replyText.trim();

        if (!content) {
            showToast.error(
                "Reply cannot be empty."
            );

            return;
        }

        if (!onReply) {
            return;
        }

        try {
            setSubmittingReply(true);
            setError(null);

            await onReply(
                comment,
                content
            );

            setReplyText("");
            setShowReplyBox(false);

            showToast.success(
                "Reply added successfully."
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to add reply.";

            setError(message);

            showToast.error(
                message
            );
        } finally {
            setSubmittingReply(false);
        }
    }

    /* =====================================================
       DELETE
    ===================================================== */

    async function handleDelete() {
        if (
            deleting ||
            !onDelete
        ) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);
            setMenuOpen(false);

            await onDelete(
                comment.id
            );

            showToast.success(
                "Comment deleted successfully."
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to delete comment.";

            setError(message);

            showToast.error(
                message
            );
        } finally {
            setDeleting(false);
        }
    }

    /* =====================================================
       EDIT MODE
    ===================================================== */

    if (isEditing) {
        return (
            <div
                className="space-y-2"
                style={{
                    marginLeft:
                        depth > 0
                            ? `${
                                Math.min(
                                    depth,
                                    4
                                ) * 20
                            }px`
                            : undefined,
                }}
            >
                <div
                    className="
                        rounded-xl
                        border
                        border-[#1e3254]
                        bg-[#081423]
                        p-3
                    "
                >
                    {/* USER HEADER */}

                    <div className="flex items-center gap-2">

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#17D4C3]
                                text-xs
                                font-semibold
                                text-[#06141f]
                            "
                        >
                            {comment.userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white">
                                {
                                    comment.userName
                                }
                            </p>

                            <p className="text-[10px] text-[#526d8e]">
                                Editing comment
                            </p>
                        </div>
                    </div>

                    {/* EDIT INPUT */}

                    <textarea
                        value={
                            editText
                        }
                        onChange={(
                            event
                        ) =>
                            setEditText(
                                event
                                    .target
                                    .value
                            )
                        }
                        rows={4}
                        maxLength={1000}
                        disabled={
                            savingEdit
                        }
                        className="
                            mt-3
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-[#1e3254]
                            bg-[#06111f]
                            px-3
                            py-2.5
                            text-xs
                            leading-5
                            text-white
                            outline-none
                            placeholder:text-[#526d8e]
                            focus:border-[#17D4C3]
                            disabled:opacity-60
                        "
                    />

                    {error && (
                        <p className="mt-2 text-[10px] text-[#ef8b8b]">
                            {error}
                        </p>
                    )}

                    {/* EDIT ACTIONS */}

                    <div className="mt-3 flex justify-end gap-2">

                        <button
                            type="button"
                            onClick={() => {
                                setEditText(
                                    comment.content
                                );

                                setError(
                                    null
                                );

                                setIsEditing(
                                    false
                                );
                            }}
                            disabled={
                                savingEdit
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                text-[#7189a8]
                                transition
                                hover:bg-[#10283e]
                                hover:text-white
                                disabled:opacity-50
                            "
                        >
                            <X
                                size={12}
                            />

                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                void handleEdit()
                            }
                            disabled={
                                savingEdit
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                bg-[#17D4C3]
                                px-3
                                py-1.5
                                text-[11px]
                                font-semibold
                                text-[#06141f]
                                transition
                                hover:bg-[#35e2d3]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Check
                                size={12}
                            />

                            {savingEdit
                                ? "Saving..."
                                : "Save"}
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    /* =====================================================
       NORMAL COMMENT
    ===================================================== */

    return (
        <div
            className="space-y-2"
            style={{
                marginLeft:
                    depth > 0
                        ? `${
                            Math.min(
                                depth,
                                4
                            ) * 20
                        }px`
                        : undefined,
            }}
        >
            <div
                className="
                    rounded-xl
                    border
                    border-[#1e3254]
                    bg-[#081423]
                    p-3
                "
            >
                {/* =================================================
                    COMMENT HEADER
                ================================================= */}

                <div className="flex items-start justify-between gap-3">

                    {/* USER */}

                    <div className="flex min-w-0 items-center gap-2">

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#17D4C3]
                                text-xs
                                font-semibold
                                text-[#06141f]
                            "
                        >
                            {comment.userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                            <div className="flex items-center gap-2">

                                <p className="truncate text-xs font-semibold text-white">
                                    {
                                        comment.userName
                                    }
                                </p>

                            </div>

                            <p className="text-[10px] text-[#526d8e]">
                                {formatRelativeTime(
                                    comment.createdAt
                                )}
                            </p>

                        </div>
                    </div>

                    {/* =================================================
                        THREE DOT MENU
                    ================================================= */}

                    {isOwner && (
                        <div
                            ref={menuRef}
                            className="relative z-30 shrink-0"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuOpen(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                                disabled={
                                    deleting ||
                                    savingEdit
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-[#7189a8]
                                    transition
                                    hover:bg-[#10283e]
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                aria-label="Comment options"
                                aria-haspopup="menu"
                                aria-expanded={
                                    menuOpen
                                }
                            >
                                <MoreVertical
                                    size={17}
                                />
                            </button>

                            {menuOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-full
                                        z-50
                                        mt-2
                                        w-32
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-[#1e3254]
                                        bg-[#0f1e35]
                                        p-1
                                        shadow-2xl
                                    "
                                    role="menu"
                                >
                                    {/* EDIT */}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditText(
                                                comment.content
                                            );

                                            setError(
                                                null
                                            );

                                            setIsEditing(
                                                true
                                            );

                                            setMenuOpen(
                                                false
                                            );
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-3
                                            py-2
                                            text-left
                                            text-xs
                                            text-[#a8bad0]
                                            transition
                                            hover:bg-[#10283e]
                                            hover:text-white
                                        "
                                        role="menuitem"
                                    >
                                        <Pencil
                                            size={13}
                                        />

                                        Edit
                                    </button>

                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            void handleDelete()
                                        }
                                        disabled={
                                            deleting
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-3
                                            py-2
                                            text-left
                                            text-xs
                                            text-[#ef8b8b]
                                            transition
                                            hover:bg-[#24151b]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                        role="menuitem"
                                    >
                                        <Trash2
                                            size={13}
                                        />

                                        {deleting
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* =================================================
                    COMMENT CONTENT
                ================================================= */}

                <p
                    className="
                        mt-3
                        whitespace-pre-wrap
                        text-xs
                        leading-5
                        text-[#a8bad0]
                    "
                >
                    {
                        comment.content
                    }
                </p>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <p className="mt-2 text-[10px] text-[#ef8b8b]">
                        {error}
                    </p>
                )}

                {/* =================================================
                    COMMENT ACTIONS
                ================================================= */}

                <div className="mt-3 flex items-center gap-4">

                    {/* REPLY */}

                    {onReply && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowReplyBox(
                                    (
                                        current
                                    ) =>
                                        !current
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-[10px]
                                text-[#7189a8]
                                transition
                                hover:text-[#17D4C3]
                            "
                        >
                            <MessageCircle
                                size={12}
                            />

                            Reply
                        </button>
                    )}

                </div>

                {/* =================================================
                    REPLY BOX
                ================================================= */}

                {showReplyBox &&
                    onReply && (
                        <div className="mt-3">

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
                                placeholder="Write a reply..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-[#1e3254]
                                    bg-[#06111f]
                                    px-3
                                    py-2.5
                                    text-xs
                                    leading-5
                                    text-white
                                    outline-none
                                    placeholder:text-[#526d8e]
                                    focus:border-[#17D4C3]
                                    disabled:opacity-60
                                "
                            />

                            <div className="mt-2 flex justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleReply()
                                    }
                                    disabled={
                                        submittingReply ||
                                        !replyText.trim()
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        bg-[#17D4C3]
                                        px-3
                                        py-1.5
                                        text-[10px]
                                        font-semibold
                                        text-[#06141f]
                                        transition
                                        hover:bg-[#35e2d3]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    <Send
                                        size={11}
                                    />

                                    {submittingReply
                                        ? "Sending..."
                                        : "Reply"}
                                </button>

                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}