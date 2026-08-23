import { Bookmark, Heart, MessageCircle } from "lucide-react";

interface PostActionsProps {
    liked: boolean;
    saved: boolean;
    likeCount: number;
    commentCount: number;
    commentsOpen?: boolean;
    onLike: () => void | Promise<void>;
    onSave: () => void | Promise<void>;
    onComments: () => void;
}

export default function PostActions({
                                        liked,
                                        saved,
                                        likeCount,
                                        commentCount,
                                        commentsOpen = false,
                                        onLike,
                                        onSave,
                                        onComments,
                                    }: PostActionsProps) {
    return (
        <div className="mt-5 flex items-center justify-between border-t border-[#1e3254] pt-4">
            <div className="flex items-center gap-5">
                <button
                    type="button"
                    onClick={() => void onLike()}
                    className={`inline-flex items-center gap-1.5 text-xs transition ${
                        liked ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"
                    }`}
                    aria-label={liked ? "Unlike post" : "Like post"}
                >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    <span>{likeCount}</span>
                </button>

                <button
                    type="button"
                    onClick={onComments}
                    className={`inline-flex items-center gap-1.5 text-xs transition ${
                        commentsOpen ? "text-[#17D4C3]" : "text-[#7189a8] hover:text-[#17D4C3]"
                    }`}
                    aria-label={`View ${commentCount} comments`}
                    aria-expanded={commentsOpen}
                >
                    <MessageCircle size={16} />
                    <span>{commentCount}</span>
                </button>
            </div>

            <button
                type="button"
                onClick={() => void onSave()}
                className={`rounded-lg p-2 transition ${
                    saved ? "text-[#17D4C3]" : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"
                }`}
                aria-label={saved ? "Unsave post" : "Save post"}
            >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>
        </div>
    );
}
