import { MessageCircle, Bookmark, Heart, Pin } from "lucide-react";
import type { CommunityPost } from "../../../types/community.types";

interface CommunityPostCardProps {
    post: CommunityPost;
    liked: boolean;
    saved: boolean;
    onLike: (postId: number) => void;
    onSave: (postId: number) => void;
    onOpen: (postId: number) => void;
}

export default function CommunityPostCard({
                                              post,
                                              liked,
                                              saved,
                                              onLike,
                                              onSave,
                                              onOpen,
                                          }: CommunityPostCardProps) {
    return (
        <article className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 transition hover:border-[#29466d]">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#123b48] text-sm font-semibold text-[#17D4C3]">
                        {post.userName?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            {post.userName}
                        </p>

                        <p className="text-xs text-[#617b9d]">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {post.isPinned && (
                    <Pin className="h-4 w-4 shrink-0 text-[#17D4C3]" />
                )}
            </div>

            {post.technologyName && (
                <div className="mt-4 inline-flex rounded-full border border-[#24506a] bg-[#10283e] px-3 py-1 text-[11px] font-medium text-[#6edbd2]">
                    {post.technologyName}
                </div>
            )}

            <button
                type="button"
                onClick={() => onOpen(post.id)}
                className="mt-4 block w-full text-left"
            >
                <h2 className="text-lg font-semibold text-white">
                    {post.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#91a6c2]">
                    {post.content}
                </p>
            </button>

            <div className="mt-5 flex items-center gap-5 border-t border-[#1e3254] pt-4">
                <button
                    type="button"
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 text-xs transition ${
                        liked
                            ? "text-[#17D4C3]"
                            : "text-[#7189a8] hover:text-white"
                    }`}
                >
                    <Heart
                        className="h-4 w-4"
                        fill={liked ? "currentColor" : "none"}
                    />
                    {post.likeCount}
                </button>

                <button
                    type="button"
                    onClick={() => onOpen(post.id)}
                    className="flex items-center gap-2 text-xs text-[#7189a8] hover:text-white"
                >
                    <MessageCircle className="h-4 w-4" />
                    {post.commentCount}
                </button>

                <button
                    type="button"
                    onClick={() => onSave(post.id)}
                    className={`ml-auto flex items-center gap-2 text-xs transition ${
                        saved
                            ? "text-[#17D4C3]"
                            : "text-[#7189a8] hover:text-white"
                    }`}
                >
                    <Bookmark
                        className="h-4 w-4"
                        fill={saved ? "currentColor" : "none"}
                    />
                    {saved ? "Saved" : "Save"}
                </button>
            </div>
        </article>
    );
}