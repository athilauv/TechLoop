import {
    Bookmark,
    Heart,
    MessageCircle,
} from "lucide-react";
import { useState } from "react";

import type { CommunityPost } from "../../../types/community.types";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";
import PostCommentsSection from "./PostCommentsSection";

interface CommunityPostCardProps {
    post: CommunityPost;

    liked: boolean;
    saved: boolean;

    currentUserId?: string;

    onLike: (postId: number) => void;
    onSave: (postId: number) => void;
}

export default function CommunityPostCard({
                                              post,
                                              liked,
                                              saved,
                                              currentUserId,
                                              onLike,
                                              onSave,
                                          }: CommunityPostCardProps) {
    const [commentsOpen, setCommentsOpen] =
        useState(false);

    return (
        <article className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 transition hover:border-[#24506a]">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3] text-sm font-bold text-[#06141f]">
                        {post.userName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-white">
                                {post.userName}
                            </p>

                            {post.isPinned && (
                                <span className="rounded-full border border-[#24506a] px-2 py-0.5 text-[9px] font-semibold text-[#17D4C3]">
                                    Pinned
                                </span>
                            )}
                        </div>

                        <p className="mt-0.5 text-[10px] text-[#526d8e]">
                            {formatRelativeTime(
                                post.createdAt
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Technology */}
            {post.technologyName && (
                <div className="mt-4">
                    <span className="inline-flex rounded-full border border-[#24506a] bg-[#0a2638] px-2.5 py-1 text-[10px] font-medium text-[#17D4C3]">
                        {post.technologyName}
                    </span>
                </div>
            )}

            {/* Title */}
            <h2 className="mt-4 text-base font-semibold text-white">
                {post.title}
            </h2>

            {/* Content */}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#a8bad0]">
                {post.content}
            </p>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-[#1e3254] pt-4">
                <div className="flex items-center gap-5">
                    {/* Like */}
                    <button
                        type="button"
                        onClick={() =>
                            onLike(post.id)
                        }
                        className={`inline-flex items-center gap-1.5 text-xs transition ${
                            liked
                                ? "text-[#17D4C3]"
                                : "text-[#7189a8] hover:text-[#17D4C3]"
                        }`}
                    >
                        <Heart
                            size={16}
                            fill={
                                liked
                                    ? "currentColor"
                                    : "none"
                            }
                        />

                        <span>
                            {post.likeCount}
                        </span>
                    </button>

                    {/* Comments */}
                    <button
                        type="button"
                        onClick={() =>
                            setCommentsOpen(
                                (current) => !current
                            )
                        }
                        className={`inline-flex items-center gap-1.5 text-xs transition ${
                            commentsOpen
                                ? "text-[#17D4C3]"
                                : "text-[#7189a8] hover:text-[#17D4C3]"
                        }`}
                    >
                        <MessageCircle
                            size={16}
                        />

                        <span>
                            {post.commentCount}
                        </span>
                    </button>
                </div>

                {/* Save */}
                <button
                    type="button"
                    onClick={() =>
                        onSave(post.id)
                    }
                    className={`rounded-lg p-2 transition ${
                        saved
                            ? "text-[#17D4C3]"
                            : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"
                    }`}
                    aria-label={
                        saved
                            ? "Unsave post"
                            : "Save post"
                    }
                >
                    <Bookmark
                        size={16}
                        fill={
                            saved
                                ? "currentColor"
                                : "none"
                        }
                    />
                </button>
            </div>

            {/* Inline comments */}
            {commentsOpen && (
                <PostCommentsSection
                    postId={post.id}
                    currentUserId={
                        currentUserId
                    }
                />
            )}
        </article>
    );
}