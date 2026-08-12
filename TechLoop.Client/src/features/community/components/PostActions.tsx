import {
    Bookmark,
    Heart,
    MessageCircle,
} from "lucide-react";

interface PostActionsProps {
    liked: boolean;
    saved: boolean;
    likeCount: number;
    commentCount: number;
    onLike: () => void;
    onSave: () => void;
    onComment: () => void;
    disabled?: boolean;
}

export default function PostActions({
                                        liked,
                                        saved,
                                        likeCount,
                                        commentCount,
                                        onLike,
                                        onSave,
                                        onComment,
                                        disabled = false,
                                    }: PostActionsProps) {
    return (
        <div className="flex items-center justify-between border-t border-[#1e3254] pt-4">
            <div className="flex items-center gap-2">
                {/* LIKE */}
                <button
                    type="button"
                    onClick={onLike}
                    disabled={disabled}
                    className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        ${
                        liked
                            ? "bg-[#163d42] text-[#17D4C3]"
                            : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"
                    }
                    `}
                >
                    <Heart
                        size={16}
                        fill={liked ? "currentColor" : "none"}
                    />

                    <span>{likeCount}</span>
                </button>

                {/* COMMENT */}
                <button
                    type="button"
                    onClick={onComment}
                    disabled={disabled}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#7189a8] transition hover:bg-[#10283e] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <MessageCircle size={16} />

                    <span>{commentCount}</span>
                </button>
            </div>

            {/* SAVE */}
            <button
                type="button"
                onClick={onSave}
                disabled={disabled}
                className={`
                    rounded-lg
                    p-2
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${
                    saved
                        ? "bg-[#163d42] text-[#17D4C3]"
                        : "text-[#7189a8] hover:bg-[#10283e] hover:text-white"
                }
                `}
                aria-label={
                    saved
                        ? "Unsave post"
                        : "Save post"
                }
            >
                <Bookmark
                    size={16}
                    fill={saved ? "currentColor" : "none"}
                />
            </button>
        </div>
    );
}