import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {createDiscussion, deleteDiscussion, getQuestionDiscussions,} from "../../../../api/discussion.api";
import { getCurrentUserId } from "../../../../utils/auth.ts";
import DiscussionCard from "../components/Discussion/DiscussionCard";

export default function QuestionDiscussionsPage() {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const id = Number(questionId);
    const currentUserId = getCurrentUserId();

    const [createOpen, setCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [creating, setCreating] = useState(false);
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        data: discussions = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["question-discussions", id],
        queryFn: () => getQuestionDiscussions(id),
        enabled: id > 0,
    });

    const handleCreate = async () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent || creating) return;

        try {
            setCreating(true);

            await createDiscussion({
                questionId: id,
                title: trimmedTitle,
                content: trimmedContent,
            });

            setTitle("");
            setContent("");
            setCreateOpen(false);
            await refetch();

            toast.success("Discussion created successfully.");
        } catch (error: unknown) {
            console.error("Failed to create discussion:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create discussion."
            );
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (discussionId: number) => {
        if (deletingId) return;

        if (!window.confirm("Are you sure you want to delete this discussion?")) {
            setOpenMenu(null);
            return;
        }

        try {
            setDeletingId(discussionId);
            setOpenMenu(null);

            await deleteDiscussion(discussionId);
            await refetch();

            toast.success("Discussion deleted successfully.");
        } catch (error: unknown) {
            console.error("Failed to delete discussion:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete discussion."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (!id || id <= 0) {
        return (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
                Invalid question.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigate(`/learner/coding-questions/${id}`)}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft size={17} />
                    Back to Question
                </button>

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17D4C3] text-[#06131f] transition hover:bg-[#20e5d3]"
                    aria-label="Create discussion"
                >
                    <Plus size={19} />
                </button>
            </div>

            <div>
                <h1 className="text-2xl font-semibold text-white">
                    Discussions
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Discuss this coding question with other learners.
                </p>
            </div>

            {createOpen && (
                <div className="rounded-xl border border-[#1e3254] bg-[#0E1B2E] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">
                            Create Discussion
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                setCreateOpen(false);
                                setTitle("");
                                setContent("");
                            }}
                            className="text-xs text-slate-500 transition hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>

                    <input
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        maxLength={200}
                        placeholder="Discussion title..."
                        className="mt-4 w-full rounded-lg border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                    />

                    <textarea
                        value={content}
                        onChange={event => setContent(event.target.value)}
                        rows={5}
                        maxLength={5000}
                        placeholder="Write your discussion..."
                        className="mt-3 w-full resize-none rounded-lg border border-[#1e3254] bg-[#06111f] px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-[#526d8e] focus:border-[#17D4C3]"
                    />

                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            onClick={() => void handleCreate()}
                            disabled={
                                creating ||
                                !title.trim() ||
                                !content.trim()
                            }
                            className="rounded-lg bg-[#17D4C3] px-4 py-2 text-sm font-medium text-[#06131f] transition hover:bg-[#20e5d3] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Create Discussion"}
                        </button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(item => (
                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-xl border border-white/5 bg-[#0E1B2E]"
                        />
                    ))}
                </div>
            )}

            {isError && !isLoading && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
                    Unable to load discussions.
                </div>
            )}

            {!isLoading && !isError && discussions.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0E1B2E] px-6 py-14 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#17D4C3]/10 text-[#17D4C3]">
                        <MessageCircle size={22} />
                    </div>

                    <h2 className="text-base font-semibold text-white">
                        No discussions yet
                    </h2>

                    <p className="mt-1 max-w-sm text-sm text-slate-400">
                        Be the first learner to start a discussion about this question.
                    </p>

                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#17D4C3] px-4 py-2 text-sm font-medium text-[#06131f] transition hover:bg-[#20e5d3]"
                    >
                        <Plus size={16} />
                        Start Discussion
                    </button>
                </div>
            )}

            {!isLoading && !isError && discussions.length > 0 && (
                <div className="space-y-4">
                    {discussions.map(discussion => (
                        <DiscussionCard
                            key={discussion.id}
                            discussion={discussion}
                            currentUserId={currentUserId}
                            menuOpen={openMenu === discussion.id}
                            deleting={deletingId === discussion.id}
                            onMenu={() =>
                                setOpenMenu(
                                    openMenu === discussion.id
                                        ? null
                                        : discussion.id
                                )
                            }
                            onDelete={() =>
                                void handleDelete(discussion.id)
                            }
                            onRefresh={refetch}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}