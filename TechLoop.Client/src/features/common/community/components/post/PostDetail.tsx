import { ArrowLeft, Bookmark, Heart, MessageCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CommunityPost, CommunityRole, CommunityTechnology } from "../../../../../types/community.types.ts";
import { useCurrentUser} from "../../../../../hooks/useCurrentUser.ts";
import { isMentor } from "../../../../../utils/isMentor.ts";
import MentorBadge from "../shared/MentorBadge";
import PostComposer from "../composer/PostComposer";
import CommentsSection from "../comment/CommentsSection";
import { formatRelativeTime } from "../../../../../utils/formatRelativeTime";
import { showToast } from "../../../../../utils/toast";

interface PostDetailProps {
    post: CommunityPost;
    role: CommunityRole;
    liked: boolean;
    saved: boolean;
    currentUserId?: string;
    technologies?: CommunityTechnology[];
    onBack: () => void;
    onLike: () => void | Promise<void>;
    onSave: () => void | Promise<void>;
    onEdit: (technologyId: number | null, title: string, content: string) => Promise<void>;
    onDelete: () => Promise<void>;
}

export default function PostDetail({
                                       post,
                                       role,
                                       liked,
                                       saved,
                                       currentUserId,
                                       technologies = [],
                                       onBack,
                                       onLike,
                                       onSave,
                                       onEdit,
                                       onDelete,
                                   }: PostDetailProps) {
    const currentUser = useCurrentUser(currentUserId);
    const isOwner = currentUser.owns(post);

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

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

    function handleDeleteClick() {
        showToast.confirm(
            "Delete Post",
            "Are you sure you want to delete this discussion? This action cannot be undone.",
            () => void onDelete(),
            undefined,
            "Delete"
        );
    }

    async function handleEditSubmit(technologyId: number | null, title: string, content: string) {
        setSavingEdit(true);
        try {
            await onEdit(technologyId, title, content);
            setEditing(false);
            setMenuOpen(false);
        } finally {
            setSavingEdit(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={onBack}
                className="mb-5 inline-flex items-center gap-2 text-xs text-[#7189a8] transition hover:text-white"
            >
                <ArrowLeft size={15} />
                Back to Community
            </button>

            <article className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-bold text-[#06141f]">
                            {post.userName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-white">
                                    {post.userName}
                                </p>
                                {isMentor(post) && <MentorBadge />}
                            </div>
                            <p className="mt-0.5 text-[10px] text-[#526d8e]">
                                {formatRelativeTime(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {isOwner && !editing && (
                        <div ref={menuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((current) => !current)}
                                className="rounded-lg p-1.5 text-[#526d8e] transition hover:bg-[#10283e] hover:text-white"
                                aria-label="Post options"
                                aria-expanded={menuOpen}
                            >
                                <MoreVertical size={17} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full z-30 mt-1 w-32 rounded-xl border border-[#1e3254] bg-[#0f1e35] p-1 shadow-xl">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(true);
                                            setMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#a8bad0] transition hover:bg-[#10283e] hover:text-white"
                                    >
                                        <Pencil size={13} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#a8bad0] transition hover:bg-[#24151b] hover:text-[#ef8b8b]"
                                    >
                                        <Trash2 size={13} />
                                        Delete
                                    </button>
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
                            <div className="mt-5">
                                <span className="inline-flex rounded-full border border-[#24506a] bg-[#0a2638] px-2.5 py-1 text-[10px] font-medium text-[#17D4C3]">
                                    {post.technologyName}
                                </span>
                            </div>
                        )}

                        <h1 className="mt-4 text-xl font-semibold text-white">{post.title}</h1>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#a8bad0]">
                            {post.content}
                        </p>

                        <div className="mt-6 flex items-center gap-5 border-t border-[#1e3254] pt-4">
                            <button
                                type="button"
                                onClick={() => void onLike()}
                                className={`inline-flex items-center gap-1.5 text-xs transition ${
                                    liked ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"
                                }`}
                            >
                                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                                {post.likeCount}
                            </button>

                            <span className="inline-flex items-center gap-1.5 text-xs text-[#7189a8]">
                                <MessageCircle size={16} />
                                {post.commentCount}
                            </span>

                            <button
                                type="button"
                                onClick={() => void onSave()}
                                className={`ml-auto rounded-lg p-2 transition ${
                                    saved
                                        ? "text-[#17D4C3]"
                                        : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"
                                }`}
                                aria-label={saved ? "Unsave post" : "Save post"}
                            >
                                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </>
                )}
            </article>

            <div className="mt-5 rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5">
                <CommentsSection role={role} postId={post.id} currentUserId={currentUser.id ?? ""} />
            </div>
        </div>
    );
}
