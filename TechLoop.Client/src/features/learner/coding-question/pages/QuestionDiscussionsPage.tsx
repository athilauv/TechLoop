import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner";
import { showToast } from "../../../../utils/toast.tsx";
import {
    createDiscussion,
    createDiscussionComment,
    deleteDiscussion,
    deleteDiscussionComment,
    getDiscussionComments,
    getQuestionDiscussions,
    updateDiscussion,
    updateDiscussionComment,
} from "../../../../api/discussion.api.ts";
import type { Discussion, DiscussionComment } from "../../../../types/discussion.types.ts";
import { useCurrentUserId } from "../../../../hooks/useCurrentUserId.ts";
import DiscussionList from "../../../common/Discussion/components/DiscussionList.tsx";
import DiscussionForm from "../../../common/Discussion/components/DiscussionForm.tsx";

const QuestionDiscussionsPage = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();

    const [creating, setCreating] = useState(false);

    const parsedQuestionId = Number(questionId);
    const validQuestionId = Number.isInteger(parsedQuestionId) && parsedQuestionId > 0;

    const {
        data: discussions = [],
        isLoading,
        isError,
    } = useQuery<Discussion[]>({
        queryKey: ["question-discussions", parsedQuestionId],
        queryFn: () => getQuestionDiscussions(parsedQuestionId),
        enabled: validQuestionId,
    });

    const invalidateDiscussions = () =>
        queryClient.invalidateQueries({
            queryKey: ["question-discussions", parsedQuestionId],
        });

    const handleCreateDiscussion = async (title: string, content: string) => {
        try {
            await createDiscussion({ questionId: parsedQuestionId, title, content });
            showToast.success("Discussion created successfully.");
            setCreating(false);
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to create discussion.",
            );
        }
    };

    const handleEditDiscussion = async (discussion: Discussion, title: string, content: string) => {
        try {
            await updateDiscussion({ id: discussion.id, title, content });
            showToast.success("Discussion updated successfully.");
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(
                error instanceof Error ? error.message : "Failed to update discussion.",
            );
        }
    };

    const handleDeleteDiscussion = async (discussion: Discussion): Promise<void> => {
        showToast.confirm(
            "Delete Discussion",
            "Are you sure you want to delete this discussion? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteDiscussion(discussion.id);
                        showToast.success("Discussion deleted successfully.");
                        await invalidateDiscussions();
                    } catch (error) {
                        showToast.error(
                            error instanceof Error
                                ? error.message
                                : "Failed to delete discussion.",
                        );
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    const handleCreateComment = async (discussion: Discussion, content: string) => {
        try {
            await createDiscussionComment(discussion.id, { content, parentCommentId: null });
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(error instanceof Error ? error.message : "Failed to post comment.");
            throw error;
        }
    };

    const handleReplyComment = async (
        discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => {
        try {
            await createDiscussionComment(discussion.id, {
                content,
                parentCommentId: comment.id,
            });
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(error instanceof Error ? error.message : "Failed to post reply.");
            throw error;
        }
    };

    const handleEditComment = async (
        _discussion: Discussion,
        comment: DiscussionComment,
        content: string,
    ) => {
        try {
            await updateDiscussionComment(comment.id, { content });
        } catch (error) {
            showToast.error(error instanceof Error ? error.message : "Failed to update comment.");
            throw error;
        }
    };

    const handleDeleteComment = async (_discussion: Discussion, comment: DiscussionComment) => {
        try {
            await deleteDiscussionComment(comment.id);
        } catch (error) {
            showToast.error(error instanceof Error ? error.message : "Failed to delete comment.");
            throw error;
        }
    };

    if (!validQuestionId) {
        return (
            <div className="px-6 py-6">
                <p className="text-sm text-[var(--cs-text-muted)]">Invalid question.</p>
            </div>
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Questions", onClick: () => navigate(-1) },
                    { label: "Discussions" },
                ]}
            />

            <div className="mx-auto mt-6 max-w-4xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[var(--cs-text)]">Discussions</h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                            Ask questions, share approaches, and help each other out.
                        </p>
                    </div>

                    {!creating && (
                        <button
                            type="button"
                            onClick={() => setCreating(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-primary,#00e5c0)] bg-[var(--cs-primary,#00e5c0)] px-4 py-2.5 text-sm font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)]"
                        >
                            <MessageSquarePlus size={16} />
                            New Discussion
                        </button>
                    )}
                </div>

                {creating && (
                    <div className="mt-5 rounded-xl border border-[var(--cs-border)]/60 bg-[var(--cs-surface)]/50 p-5 backdrop-blur-sm">
                        <h2 className="mb-3 text-sm font-semibold text-[var(--cs-text)]">
                            Start a new discussion
                        </h2>
                        <DiscussionForm
                            submitLabel="Post Discussion"
                            submittingLabel="Posting..."
                            onCancel={() => setCreating(false)}
                            onSubmit={handleCreateDiscussion}
                        />
                    </div>
                )}

                <div className="mt-6">
                    {isLoading && discussions.length === 0 ? (
                        <div className="flex justify-center py-16">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <DiscussionList
                            discussions={discussions}
                            isLoading={isLoading}
                            isError={isError}
                            currentUserId={currentUserId}
                            fetchComments={getDiscussionComments}
                            onCreateComment={handleCreateComment}
                            onReplyComment={handleReplyComment}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            onEditDiscussion={handleEditDiscussion}
                            onDeleteDiscussion={handleDeleteDiscussion}
                            emptyTitle="No discussions yet"
                            emptyDescription="Be the first to start a discussion for this question."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionDiscussionsPage;
