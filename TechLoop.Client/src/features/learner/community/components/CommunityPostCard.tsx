import {
    Bookmark,
    Check,
    Heart,
    MessageCircle,
    MoreVertical,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import {useEffect, useRef, useState,} from "react";
import type {CommunityPost,} from "../../../../types/community.types";
import {formatRelativeTime,} from "../../../../utils/formatRelativeTime";
import {showToast,} from "../../../../utils/toast.tsx";
import PostCommentsSection from "../components/PostCommentsSection";

interface CommunityPostCardProps {
    post: CommunityPost;
    liked: boolean;
    saved: boolean;
    currentUserId?: string;
    onLike: (postId: number) => void | Promise<void>;
    onSave: (postId: number) => void | Promise<void>;
    onOpen?: (postId: number) => void;
    onEdit?: (
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) => Promise<void>;
    onDelete?: (postId: number) => Promise<void>;
}

interface CurrentUser {
    id?: string;
    username?: string;
}

function getCurrentUser(providedUserId?: string): CurrentUser {
    let id = providedUserId?.trim() || localStorage.getItem("userId")?.trim() || undefined;
    let username = localStorage.getItem("username")?.trim() || localStorage.getItem("userName")?.trim() || undefined;
    const token = localStorage.getItem("accessToken");
    if (token && (!id || !username)) {
        try {
            const parts = token.split(".");
            if (parts.length === 3) {
                const base64Url = parts[1];

                const base64 = base64Url
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");

                const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
                const json = decodeURIComponent(atob(padded)
                            .split("")
                            .map((character) => "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
                            ).join("")
                    );

                const payload = JSON.parse(json) as Record<string, unknown>;

                if (!id) {
                    const tokenUserId =
                        payload["sub"] ??
                        payload["userId"] ??
                        payload["nameid"] ??
                        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                    if (typeof tokenUserId === "string") {
                        id = tokenUserId.trim();
                    }
                }

                if (!username) {
                    const tokenUsername = payload["unique_name"] ??
                        payload["username"] ??
                        payload["userName"] ??
                        payload["preferred_username"] ??
                        payload["name"] ??
                        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                    if (typeof tokenUsername === "string") {
                        username = tokenUsername.trim();
                    }
                }
            }
        } catch {
            /*

             */
        }
    }

    return {
        id,
        username,
    };
}


export default function CommunityPostCard({
                                              post,
                                              liked,
                                              saved,
                                              currentUserId,
                                              onLike,
                                              onSave,
                                              onOpen,
                                              onEdit,
                                              onDelete,
                                          }: CommunityPostCardProps) {
    const [commentsOpen, setCommentsOpen,] = useState(false);
    const [menuOpen, setMenuOpen,] = useState(false);
    const [editing, setEditing,] = useState(false);
    const [editTitle, setEditTitle,] = useState(post.title);
    const [editContent, setEditContent,] = useState(post.content);
    const [savingEdit, setSavingEdit,] = useState(false);
    const [deleting, setDeleting,] = useState(false);
    const [error, setError,] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const currentUser = getCurrentUser(currentUserId);
    const normalizedCurrentUserId = currentUser.id?.trim().toLowerCase();
    const normalizedPostUserId = post.userId?.trim().toLowerCase();
    const normalizedCurrentUsername = currentUser.username?.trim().toLowerCase();
    const normalizedPostUsername = post.userName?.trim().toLowerCase();

    const isOwner =
        (!!normalizedCurrentUserId && !!normalizedPostUserId && normalizedCurrentUserId === normalizedPostUserId) ||
        (!!normalizedCurrentUsername && !!normalizedPostUsername && normalizedCurrentUsername === normalizedPostUsername);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        function handleOutsideClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [menuOpen]);

    function openEdit() {
        setEditTitle(post.title);
        setEditContent(post.content);
        setError(null);
        setEditing(true);
        setMenuOpen(false);
    }

    function cancelEdit() {
        setEditTitle(post.title);
        setEditContent(post.content);
        setError(null);
        setEditing(false);
    }

    async function handleEdit() {
        const title = editTitle.trim();
        const content = editContent.trim();

        if (!title) {
            showToast.error("Title is required.");
            return;
        }

        if (!content) {
            showToast.error("Content is required.");
            return;
        }

        if (!onEdit) {
            showToast.error("Post update is not available.");
            return;
        }

        try {
            setSavingEdit(true);
            setError(null);

            await onEdit(post.id, post.technologyId, title, content);
            setEditing(false);
            setMenuOpen(false);

            showToast.success("Post updated successfully.");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to update post.";

            setError(message);
            showToast.error(message);
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleDelete() {
        if (!onDelete || deleting) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await onDelete(post.id);

            setMenuOpen(false);
            showToast.success("Post deleted successfully.");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to delete post.";

            setError(message);
            showToast.error(message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <article
            className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 transition hover:border-[#24506a] ">
            <div className="flex items-start justify-between gap-4">

                {/* USER */}
                <button type="button" onClick={() => onOpen?.(post.id)}
                    className=" flex min-w-0 items-center gap-3 text-left">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-bold text-[#06141f]">
                        {post.userName?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-white">
                                {post.userName}
                            </p>

                            {post.isPinned && (
                                <span
                                    className="rounded-full border border-[#24506a] px-2 py-0.5 text-[9px] font-semibold text-[#17D4C3]">
                                    Pinned
                                </span>
                            )}

                        </div>

                        <p className="mt-0.5 text-[10px] text-[#526d8e]">
                            {formatRelativeTime(post.createdAt)}
                        </p>
                    </div>
                </button>

                {isOwner && (
                    <div ref={menuRef} className="relative shrink-0">
                        <button type="button"
                            onClick={() => setMenuOpen((current) => !current)}
                            disabled={deleting || savingEdit}
                            className=" flex h-8 w-8 items-center justify-center rounded-lg
                                text-[#7189a8] transition hover:bg-[#10283e] hover:text-white
                                disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Post options" aria-haspopup="menu" aria-expanded={menuOpen}>
                            <MoreVertical size={18}/>
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 top-full z-50 mt-2
                                    w-32 overflow-hidden rounded-xl border border-[#1e3254] bg-[#0f1e35] p-1 shadow-2xl"
                                role="menu">
                                {/* EDIT */}

                                <button type="button" onClick={openEdit}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2
                                        text-left text-xs text-[#a8bad0] transition hover:bg-[#10283e] hover:text-white"
                                    role="menuitem">
                                    <Pencil size={13}/>

                                    Edit
                                </button>

                                {/* DELETE */}
                                <button type="button" onClick={() => void handleDelete()} disabled={deleting}
                                    className="flex w-full items-center] gap-2 rounded-lg px-3 py-2text-left text-xs
                                        text-[#ef8b8b] transition hover:bg-[#24151b] disabled:cursor-not-allowed disabled:opacity-50 "
                                    role="menuitem">
                                    <Trash2 size={13}/>
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className=" mt-4 rounded-xl border border-[#5c3038] bg-[#24151b] px-3 py-2 text-xs text-[#ef8b8b]">
                    {error}
                </div>
            )}

            {editing ? (
                <div className="mt-5">

                    {/* TITLE */}
                    <input
                        type="text" value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        maxLength={200} disabled={savingEdit} className="
                            w-full  rounded-xl border border-[#1e3254] bg-[#081423] px-4 py-3 text-sm font-semibold text-white
                            outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3] disabled:opacity-60"/>

                    {/* CONTENT */}

                    <textarea value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        rows={6} maxLength={5000} disabled={savingEdit}
                        className=" mt-3 w-full resize-none rounded-xl border border-[#1e3254] bg-[#081423] px-4 py-3 text-sm leading-6 text-white
                            outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3] disabled:opacity-60 "/>

                    {/* EDIT ACTIONS */}
                    <div className="mt-3 flex items-center justify-end gap-2">

                        {/* CANCEL */}
                        <button type="button" onClick={cancelEdit} disabled={savingEdit}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#7189a8] transition hover:bg-[#10283e]
                                hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                            <X size={13}/>
                            Cancel
                        </button>

                        {/* SAVE */}
                        <button type="button" onClick={() => void handleEdit()} disabled={savingEdit}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#17D4C3] px-3 py-2 text-xs font-semibold
                                text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50">
                            <Check size={13}/>
                            {savingEdit ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {post.technologyName && (
                        <div className="mt-4">
                            <span className=" inline-flex rounded-full border border-[#24506a] bg-[#0a2638] px-2.5 py-1 text-[10px] font-medium text-[#17D4C3] ">
                                {post.technologyName}
                            </span>
                        </div>
                    )}

                    <h2 className="mt-4 text-base font-semibold text-white">
                        {post.title}
                    </h2>

                    <p className=" mt-2 whitespace-pre-wrap text-sm leading-6 text-[#a8bad0] ">
                        {post.content}
                    </p>

                    <div
                        className=" mt-5 flex items-center justify-between border-t border-[#1e3254] pt-4">
                        <div className="flex items-center gap-5">

                            {/* LIKE */}

                            <button type="button" onClick={() => void onLike(post.id)}
                                className={` inline-flex items-center gap-1.5 text-xs transition ${liked ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"}`} aria-label={liked ? "Unlike post" : "Like post"}>
                                <Heart size={16} fill={liked ? "currentColor" : "none"}/>

                                <span>
                                    {post.likeCount}
                                </span>
                            </button>

                            {/* COMMENTS */}

                            <button type="button"
                                onClick={() => setCommentsOpen((current) => !current)}
                                className={` inline-flex items-center gap-1.5 text-xs transition
                                    ${commentsOpen ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"}`}
                                aria-label={`View ${Math.max(0, post.commentCount - 1)} comments`}
                                aria-expanded={commentsOpen}>
                                <MessageCircle size={16}/>

                                <span>
                                    {Math.max(0, post.commentCount - 1)}
                                </span>
                            </button>
                        </div>

                        {/* SAVE */}

                        <button type="button" onClick={() => void onSave(post.id)}
                            className={` rounded-lg p-2 transition ${saved ? "text-[#17D4C3]" : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"}`}
                            aria-label={saved ? "Unsave post" : "Save post"}>
                            <Bookmark size={16} fill={saved ? "currentColor" : "none"}/>
                        </button>
                    </div>

                    {commentsOpen && (
                        <PostCommentsSection postId={post.id} currentUserId={currentUser.id ?? ""}/>
                    )}
                </>
            )}
        </article>
    );
}