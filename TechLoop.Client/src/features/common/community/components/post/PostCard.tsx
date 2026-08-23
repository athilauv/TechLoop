import { MoreVertical } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CommunityPost, CommunityTechnology} from "../../../../../types/community.types.ts";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser.ts";
import { isMentor } from "../../../../../utils/isMentor.ts";
import MentorBadge from "../shared/MentorBadge";
import PostActions from "./PostActions";
import PostComposer from "../composer/PostComposer";
import CommentsSection from "../comment/CommentsSection";
import { formatRelativeTime } from "../../../../../utils/formatRelativeTime";
import { showToast } from "../../../../../utils/toast";
import type { CommunityRole } from "../../../../../types/community.types.ts";

interface PostCardProps {
    post: CommunityPost;
    role: CommunityRole;
    liked: boolean;
    saved: boolean;
    currentUserId?: string;
    commentsMode?: "inline" | "navigate";
    technologies?: CommunityTechnology[];
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

export default function PostCard({
                                     post,
                                     role,
                                     liked,
                                     saved,
                                     currentUserId,
                                     commentsMode = "inline",
                                     technologies = [],
                                     onLike,
                                     onSave,
                                     onOpen,
                                     onEdit,
                                     onDelete,
                                 }: PostCardProps) {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const currentUser = useCurrentUser(currentUserId);
    const isOwner = currentUser.owns(post);

    useEffect(() => {
        if (!menuOpen) return;

        function handleOutsideClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    function handleCommentsToggle() {
        if (commentsMode === "navigate") {
            onOpen?.(post.id);
            return;
        }
        setCommentsOpen((current) => !current);
    }

    function handleDeleteClick() {
        if (!onDelete || deleting) return;

        showToast.confirm(
            "Delete Post",
            "Are you sure you want to delete this post? This action cannot be undone.",
            () => void performDelete(),
            undefined,
            "Delete"
        );
    }

    async function performDelete() {
        if (!onDelete) return;

        try {
            setDeleting(true);
            await onDelete(post.id);
            setMenuOpen(false);
        } finally {
            setDeleting(false);
        }
    }

    async function handleEditSubmit(technologyId: number | null, title: string, content: string) {
        if (!onEdit) return;

        setSavingEdit(true);
        try {
            await onEdit(post.id, technologyId, title, content);
            setEditing(false);
            setMenuOpen(false);
        } finally {
            setSavingEdit(false);
        }
    }

    const avatarLetter = post.userName?.trim().charAt(0).toUpperCase() || "U";

    return (
        <article className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 transition hover:border-[#24506a]">
            {/* AUTHOR + MENU */}
            <div className="flex items-start justify-between gap-4">
                <button
                    type="button"
                    onClick={() => (commentsMode === "navigate" ? onOpen?.(post.id) : undefined)}
                    className="flex min-w-0 items-center gap-3 text-left"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-bold text-[#06141f]">
                        {avatarLetter}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-white">{post.userName}</p>
                            {isMentor(post) && <MentorBadge />}
                        </div>

                        <p className="mt-0.5 text-[10px] text-[#526d8e]">
                            {formatRelativeTime(post.createdAt)}
                        </p>
                    </div>
                </button>

                {isOwner && (
                    <div ref={menuRef} className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((current) => !current)}
                            disabled={deleting || savingEdit}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7189a8] transition hover:bg-[#10283e] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Post options"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                        >
                            <MoreVertical size={18} />
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl border border-[#1e3254] bg-[#0f1e35] p-1 shadow-2xl"
                                role="menu"
                            >
                                {onEdit && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(true);
                                            setMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#a8bad0] transition hover:bg-[#10283e] hover:text-white"
                                        role="menuitem"
                                    >
                                        <Pencil size={13} />
                                        Edit
                                    </button>
                                )}

                                {onDelete && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        disabled={deleting}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#ef8b8b] transition hover:bg-[#24151b] disabled:cursor-not-allowed disabled:opacity-50"
                                        role="menuitem"
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
                <PostComposer
                    mode="edit"
                    variant="inline"
                    initialValues={{
                        technologyId: post.technologyId,
                        title: post.title,
                        content: post.content,
                    }}
                    technologies={technologies}
                    submitting={savingEdit}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <>
                    {post.technologyName && (
                        <div className="mt-4">
                            <span className="inline-flex rounded-full border border-[#24506a] bg-[#0a2638] px-2.5 py-1 text-[10px] font-medium text-[#17D4C3]">
                                {post.technologyName}
                            </span>
                        </div>
                    )}

                    <h2 className="mt-4 text-base font-semibold text-white">{post.title}</h2>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#a8bad0]">
                        {post.content}
                    </p>

                    <PostActions
                        liked={liked}
                        saved={saved}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                        commentsOpen={commentsOpen}
                        onLike={() => onLike(post.id)}
                        onSave={() => onSave(post.id)}
                        onComments={handleCommentsToggle}
                    />

                    {commentsMode === "inline" && commentsOpen && (
                        <div className="mt-5">
                            <CommentsSection
                                role={role}
                                postId={post.id}
                                currentUserId={currentUser.id ?? ""}
                            />
                        </div>
                    )}
                </>
            )}
        </article>
    );
}
