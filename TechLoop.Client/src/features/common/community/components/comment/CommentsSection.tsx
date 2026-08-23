import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import type { CommunityRole, PostComment} from "../../../../../types/community.types.ts";
import { useComments } from "../../../../../hooks/useComments.ts";
import CommentList from "./CommentList";
import { showToast} from "../../../../../utils/toast.tsx";

interface CommentsSectionProps {
    role: CommunityRole;
    postId: number;
    currentUserId?: string;
}

export default function CommentsSection({ role, postId, currentUserId }: CommentsSectionProps) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { comments, isLoading, error, addComment, editComment, removeComment } = useComments(
        role,
        postId
    );

    async function handleCreateComment() {
        if (!content.trim() || submitting) return;

        try {
            setSubmitting(true);
            await addComment(content);
            setContent("");
        } catch (err) {
            showToast.error(err instanceof Error ? err.message : "Unable to create comment.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReply(parentComment: PostComment, replyContent: string) {
        await addComment(replyContent, parentComment.id);
    }

    async function handleEdit(comment: PostComment, newContent: string) {
        await editComment(comment, newContent);
    }

    async function handleDelete(commentId: number) {
        await removeComment(commentId);
    }

    return (
        <div className="border-t border-[#1e3254] pt-4">
            <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-[#17D4C3]" />
                <h3 className="text-xs font-semibold text-white">Comments</h3>
                {!isLoading && <span className="text-[10px] text-[#526d8e]">{comments.length}</span>}
            </div>

            <p className="mt-1 text-[10px] text-[#7189a8]">Join the discussion.</p>

            {error && (
                <div className="mt-3 rounded-lg border border-[#5c3038] bg-[#24151b] px-3 py-2">
                    <p className="text-[10px] text-[#ef8b8b]">{error}</p>
                </div>
            )}

            <div className="mt-4">
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={3}
                    maxLength={1000}
                    disabled={submitting}
                    placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-xs leading-5 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                />

                <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[9px] text-[#526d8e]">{content.length}/1000</span>

                    <button
                        type="button"
                        onClick={() => void handleCreateComment()}
                        disabled={submitting || !content.trim()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#17D4C3] px-3 py-2 text-[10px] font-semibold text-[#06141f] transition hover:bg-[#35e2d3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={12} />
                        {submitting ? "Commenting..." : "Comment"}
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-20 animate-pulse rounded-xl bg-[#0f1e35]" />
                        <div className="h-16 animate-pulse rounded-xl bg-[#0f1e35]" />
                    </div>
                ) : (
                    <CommentList
                        comments={comments}
                        currentUserId={currentUserId}
                        onReply={handleReply}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
