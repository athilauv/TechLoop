import {
    ArrowLeft,
    Bookmark,
    Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { CommunityPost } from "../../../../types/community.types.ts";
import MentorPostComments from "./MentorPostComments";

interface MentorPostDetailsProps {
    post: CommunityPost;
    liked: boolean;
    saved: boolean;
    currentUserId?: string;
    onLike: () => Promise<void>;
    onSave: () => Promise<void>;
}

export default function MentorPostDetails({
                                              post,
                                              liked,
                                              saved,
                                              currentUserId,
                                              onLike,
                                              onSave,
                                          }: MentorPostDetailsProps) {
    const navigate = useNavigate();

    return (
        <article className="rounded-2xl border border-white/10 bg-[#0B1B30] p-5 sm:p-7">
            <button
                type="button"
                onClick={() => navigate("/mentor/community")}
                className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Community
            </button>

            <div className="flex flex-wrap items-center gap-2">
                {post.technologyName && (
                    <span className="rounded-md bg-[#18C6A4]/10 px-2 py-1 text-[10px] font-medium text-[#18C6A4]">
                        {post.technologyName}
                    </span>
                )}

                <span className="text-[10px] text-slate-600">
                    {new Date(post.createdAt).toLocaleString()}
                </span>
            </div>

            <h1 className="mt-4 text-xl font-semibold leading-8 text-white sm:text-2xl">
                {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-300">
                    {post.userName}
                </span>
            </div>

            <div className="mt-7 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {post.content}
            </div>

            <div className="mt-8 flex items-center gap-5 border-t border-white/10 pt-5">
                <button
                    type="button"
                    onClick={() => void onLike()}
                    className={`inline-flex items-center gap-2 text-xs ${
                        liked
                            ? "text-[#18C6A4]"
                            : "text-slate-500 hover:text-[#18C6A4]"
                    }`}
                >
                    <Heart
                        className="h-4 w-4"
                        fill={liked ? "currentColor" : "none"}
                    />
                    {post.likeCount}
                </button>

                <span className="text-xs text-slate-600">
                    {post.commentCount} comments
                </span>

                <button
                    type="button"
                    onClick={() => void onSave()}
                    className={`ml-auto rounded-lg p-2 ${
                        saved
                            ? "text-[#18C6A4]"
                            : "text-slate-500 hover:bg-white/5 hover:text-white"
                    }`}
                >
                    <Bookmark
                        className="h-4 w-4"
                        fill={saved ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <MentorPostComments
                postId={post.id}
                currentUserId={currentUserId}
            />
        </article>
    );
}