import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "../../../../types/community.types.ts";
import { showToast } from "../../../../utils/toast.tsx";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";

interface MentorCommunityPostCardProps {
    post: CommunityPost;
    liked: boolean;
    saved: boolean;
    currentUserId?: string;
    onLike: (postId: number) => Promise<void>;
    onSave: (postId: number) => Promise<void>;
    onEdit: (
        postId: number,
        technologyId: number | null,
        title: string,
        content: string
    ) => Promise<void>;
    onDelete: (postId: number) => Promise<void>;
}

function getInitials(name: string): string {
    const value = name.trim();

    if (!value) {
        return "U";
    }

    const parts = value.split(/\s+/);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function MentorCommunityPostCard({
                                                    post,
                                                    liked,
                                                    saved,
                                                    currentUserId,
                                                    onLike,
                                                    onSave,
                                                    onEdit,
                                                    onDelete,
                                                }: MentorCommunityPostCardProps) {
    const navigate = useNavigate();

    const isOwner =
        currentUserId?.toLowerCase() === post.userId.toLowerCase();

    const initials = getInitials(post.userName);

    const handleOpen = () => {
        navigate(`/mentor/community/post/${post.id}`);
    };

    const handleDelete = () => {
        showToast.confirm(
            "Delete Post",
            "Are you sure you want to delete this post? This action cannot be undone.",
            () => {
                void onDelete(post.id);
            },
            undefined,
            "Delete"
        );
    };

    const handleEdit = async () => {
        const title = window.prompt("Post title:", post.title);

        if (title === null) {
            return;
        }

        const content = window.prompt("Post content:", post.content);

        if (content === null) {
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle) {
            showToast.error("Post title cannot be empty.");
            return;
        }

        if (!trimmedContent) {
            showToast.error("Post content cannot be empty.");
            return;
        }

        try {
            await onEdit(
                post.id,
                post.technologyId,
                trimmedTitle,
                trimmedContent
            );
        } catch {
            // Parent handles API error toast.
        }
    };

    const handleLike = async () => {
        try {
            await onLike(post.id);
        } catch {
            // Parent handles API error toast.
        }
    };

    const handleSave = async () => {
        try {
            await onSave(post.id);
        } catch {
            // Parent handles API error toast.
        }
    };

    return (
        <article className="rounded-2xl border border-[#1e3254] bg-[#0B1B30] transition hover:border-[#29476d]">
            {/* Author */}
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                    {/* Profile image / initials */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#17D4C3]/10 text-xs font-bold text-[#17D4C3] ring-1 ring-[#17D4C3]/20">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-white">
                                {post.userName}
                            </span>

                            {post.userRoleId === 2 && (
                                <span className="rounded-full border border-[#00E5C0]/30 bg-[#00E5C0]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#00E5C0]">Mentor</span>
                            )}
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#526d8e]">
                            <span>
                                {formatRelativeTime(post.createdAt)}
                            </span>

                            {post.technologyName && (
                                <>
                                    <span>•</span>

                                    <span>
                                        {post.technologyName}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <details className="relative shrink-0">
                        <summary
                            className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-[#526d8e] transition hover:bg-white/5 hover:text-white"
                            aria-label="Post actions"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </summary>

                        <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-[#29405f] bg-[#10243B] p-1.5 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => void handleEdit()}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    </details>
                )}
            </div>

            {/* Content */}
            <button
                type="button"
                onClick={handleOpen}
                className="block w-full px-5 pt-5 text-left"
            >

                <h2 className="mt-3 text-base font-semibold leading-6 text-white transition hover:text-[#17D4C3]">
                    {post.title}
                </h2>

                <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#8da2bc]">
                    {post.content}
                </p>
            </button>

            {/* Actions */}
            <div className="mx-5 mt-5 flex items-center justify-between border-t border-[#1e3254] py-3.5">
                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        onClick={() => void handleLike()}
                        className={`inline-flex items-center gap-1.5 text-xs ${
                            liked
                                ? "text-[#17D4C3]"
                                : "text-[#7189a8] hover:text-[#17D4C3]"
                        }`}
                    >
                        <Heart
                            className="h-4 w-4"
                            fill={liked ? "currentColor" : "none"}
                        />

                        <span>{post.likeCount}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleOpen}
                        className="inline-flex items-center gap-1.5 text-xs text-[#7189a8] hover:text-[#17D4C3]"
                    >
                        <MessageCircle className="h-4 w-4" />

                        <span>{post.commentCount}</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => void handleSave()}
                    className={`rounded-lg p-2 ${
                        saved
                            ? "text-[#17D4C3]"
                            : "text-[#7189a8] hover:bg-white/5 hover:text-white"
                    }`}
                    aria-label={saved ? "Unsave post" : "Save post"}
                >
                    <Bookmark
                        className="h-4 w-4"
                        fill={saved ? "currentColor" : "none"}
                    />
                </button>
            </div>
        </article>
    );
}