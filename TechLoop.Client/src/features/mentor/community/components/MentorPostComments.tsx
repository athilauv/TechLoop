import {
    MessageCircle,
    Pencil,
    Reply,
    Send,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    createMentorComment,
    deleteMentorComment,
    getMentorPostComments,
    updateMentorComment,
} from "../../../../api/mentorCommunity.api.ts";

import type { PostComment } from "../../../../types/community.types.ts";

interface MentorPostCommentsProps {
    postId: number;
    currentUserId?: string;
}

export default function MentorPostComments({
                                               postId,
                                               currentUserId,
                                           }: MentorPostCommentsProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const loadComments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMentorPostComments(postId);
            setComments(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load comments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadComments();
    }, [postId]);

    const handleCreate = async () => {
        const trimmed = content.trim();

        if (!trimmed || submitting) return;

        try {
            setSubmitting(true);
            setError("");

            await createMentorComment(postId, {
                content: trimmed,
                parentCommentId: null,
            });

            setContent("");
            await loadComments();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create comment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (comment: PostComment) => {
        const value = window.prompt(
            "Edit comment:",
            comment.content
        );

        if (value === null || !value.trim()) return;

        try {
            await updateMentorComment(comment.id, {
                content: value.trim(),
            });

            await loadComments();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update comment."
            );
        }
    };

    const handleDelete = async (commentId: number) => {
        const confirmed = window.confirm(
            "Delete this comment?"
        );

        if (!confirmed) return;

        try {
            await deleteMentorComment(commentId);
            await loadComments();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete comment."
            );
        }
    };

    return (
        <section className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#18C6A4]" />

                <h2 className="text-sm font-semibold text-white">
                    Discussion
                </h2>

                {!loading && (
                    <span className="text-xs text-slate-600">
                        {comments.length}
                    </span>
                )}
            </div>

            <div className="mt-4">
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    rows={3}
                    maxLength={1000}
                    disabled={submitting}
                    placeholder="Share your thoughts..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#071426] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#18C6A4]/50"
                />

                <div className="mt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={() => void handleCreate()}
                        disabled={
                            submitting ||
                            !content.trim()
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#18C6A4] px-3.5 py-2 text-xs font-semibold text-[#071426] transition hover:bg-[#12B594] disabled:opacity-50"
                    >
                        <Send className="h-3.5 w-3.5" />

                        {submitting
                            ? "Commenting..."
                            : "Comment"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                    {error}
                </div>
            )}

            <div className="mt-6 space-y-3">
                {loading ? (
                    <>
                        <div className="h-20 animate-pulse rounded-xl bg-[#0B1B30]" />
                        <div className="h-20 animate-pulse rounded-xl bg-[#0B1B30]" />
                    </>
                ) : comments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">
                        <p className="text-xs text-slate-500">
                            No comments yet.
                        </p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const isOwner =
                            currentUserId?.toLowerCase() ===
                            comment.userId.toLowerCase();

                        return (
                            <div
                                key={comment.id}
                                className="rounded-xl border border-white/10 bg-[#0B1B30] p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-white">
                                            {comment.userName}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-slate-600">
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {isOwner && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void handleEdit(
                                                        comment
                                                    )
                                                }
                                                className="rounded-md p-1.5 text-slate-500 hover:bg-white/5 hover:text-white"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void handleDelete(
                                                        comment.id
                                                    )
                                                }
                                                className="rounded-md p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    {comment.content}
                                </p>

                                <button
                                    type="button"
                                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-slate-500 transition hover:text-[#18C6A4]"
                                >
                                    <Reply className="h-3 w-3" />
                                    Reply
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}