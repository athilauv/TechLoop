import { useState } from "react";
import { FileQuestion, MessageSquarePlus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import EmptyState from "../../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";

import {
    deleteQuestion,
    getMentorQuestionById,
    publishQuestion,
} from "../../../../../api/mentorQuestion.api.ts";
import { MENTOR_PENDING_QUERY_KEY } from "../../../../../hooks/useMentorPendingQueue.ts";

import {
    createDiscussion,
    createDiscussionComment,
    deleteDiscussion,
    deleteDiscussionComment,
    getDiscussionComments,
    getQuestionDiscussions,
    updateDiscussion,
    updateDiscussionComment,
} from "../../../../../api/discussion.api.ts";

import {
    pinDiscussion,
    unpinDiscussion,
} from "../../../../../api/mentorDiscussion.api.ts";

import {
    useCurrentUserId,
} from "../../../../../hooks/useCurrentUserId.ts";

import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";

import QuestionDetailHeader from "../../components/question-details/QuestionDetailHeader.tsx";
import QuestionTabs from "../../components/question-details/QuestionTabs.tsx";
import OverviewTab from "../../components/question-details/OverviewTab.tsx";
import McqOptionsSection from "../../components/mcq/McqOptionsSection.tsx";
import DiscussionList from "../../../../common/Discussion/components/DiscussionList.tsx";
import DiscussionForm from "../../../../common/Discussion/components/DiscussionForm.tsx";
import PinToggleButton from "../../components/discussions/PinToggleButton.tsx";
import type {
    Discussion,
    DiscussionComment,
} from "../../../../../types/discussion.types.ts";

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "options", label: "Options" },
    { key: "discussion", label: "Discussion" },
];

const McqQuestionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();

    const requestedTab = searchParams.get("tab");
    const validInitialTabs = new Set(TABS.map((tab) => tab.key));
    const initialTab = requestedTab && validInitialTabs.has(requestedTab)
        ? requestedTab
        : "overview";

    const [activeTab, setActiveTab] = useState(initialTab);
    const [publishing, setPublishing] = useState(false);
    const [creatingDiscussion, setCreatingDiscussion] = useState(false);

    const questionId = Number(id);
    const validQuestionId = Number.isInteger(questionId) && questionId > 0;

    const {
        data: question,
        isLoading,
        isError,
    } = useQuery<MentorQuestion>({
        queryKey: ["mentor-question", questionId],
        queryFn: () => getMentorQuestionById(questionId),
        enabled: validQuestionId,
    });

    const {
        data: discussions = [],
        isLoading: discussionsLoading,
        isError: discussionsError,
    } = useQuery<Discussion[]>({
        queryKey: ["question-discussions", questionId],
        queryFn: () => getQuestionDiscussions(questionId),
        enabled: questionId > 0 && activeTab === "discussion",
    });

    const invalidateDiscussions = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["question-discussions", questionId],
        });
    };

    const handleCreateDiscussion = async (title: string, content: string): Promise<void> => {
        try {
            await createDiscussion({ questionId, title, content });
            showToast.success("Discussion created successfully.");
            setCreatingDiscussion(false);
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to create discussion."));
            throw error;
        }
    };

    const handleEditDiscussion = async (discussion: Discussion, title: string, content: string): Promise<void> => {
        try {
            await updateDiscussion({ id: discussion.id, title, content });
            showToast.success("Discussion updated successfully.");
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to update discussion."));
            throw error;
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
                        showToast.error(getErrorMessage(error, "Failed to delete discussion."));
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    const handleCreateComment = async (discussion: Discussion, content: string): Promise<void> => {
        try {
            await createDiscussionComment(discussion.id, { content, parentCommentId: null });
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to post comment."));
            throw error;
        }
    };

    const handleReplyComment = async (discussion: Discussion, comment: DiscussionComment, content: string): Promise<void> => {
        try {
            await createDiscussionComment(discussion.id, { content, parentCommentId: comment.id });
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to post reply."));
            throw error;
        }
    };

    const handleEditComment = async (_discussion: Discussion, comment: DiscussionComment, content: string): Promise<void> => {
        try {
            await updateDiscussionComment(comment.id, { content });
            await invalidateDiscussions();
            showToast.success("Comment updated successfully.");
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to update comment."));
            throw error;
        }
    };

    const handleDeleteComment = async (_discussion: Discussion, comment: DiscussionComment): Promise<void> => {
        try {
            await deleteDiscussionComment(comment.id);
            showToast.success("Comment deleted successfully.");
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to delete comment."));
            throw error;
        }
    };

    const handleTogglePin = async (discussion: Discussion) => {
        try {
            if (discussion.isPinned) {
                await unpinDiscussion(discussion.id);
                showToast.success("Discussion unpinned.");
            } else {
                await pinDiscussion(discussion.id);
                showToast.success("Discussion pinned.");
            }
            await invalidateDiscussions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to update pin status."));
        }
    };

    const handleBack = () => navigate("/mentor/questions/mcq");

    const handleEdit = () => {
        if (question) {
            navigate(`/mentor/questions/mcq/${question.id}/edit`);
        }
    };

    const handlePublish = () => {
        if (!question) return;

        showToast.confirm(
            "Publish MCQ Question",
            "Are you sure you want to publish this MCQ question?",
            () => {
                void (async () => {
                    setPublishing(true);

                    try {
                        await publishQuestion(question.id);

                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-question", question.id],
                        });
                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-questions"],
                        });

                        await queryClient.invalidateQueries({
                            queryKey: MENTOR_PENDING_QUERY_KEY,
                        });

                        showToast.success("MCQ question published successfully.");
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(error, "Failed to publish MCQ question."),
                        );
                    } finally {
                        setPublishing(false);
                    }
                })();
            },
            undefined,
            "Publish",
        );
    };

    const handleDelete = () => {
        if (!question) return;

        showToast.confirm(
            "Delete MCQ Question",
            "Are you sure you want to delete this MCQ question? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteQuestion(question.id);

                        await queryClient.invalidateQueries({
                            queryKey: ["mentor-questions"],
                        });
                        queryClient.removeQueries({
                            queryKey: ["mentor-question", question.id],
                        });

                        showToast.success("MCQ question deleted successfully.");
                        navigate("/mentor/questions/mcq");
                    } catch (error) {
                        showToast.error(getErrorMessage(error, "Failed to delete MCQ question."));
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    if (!validQuestionId) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={<FileQuestion size={24} />}
                    title="Question not found"
                    description="The requested question could not be found."
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !question || question.questionType !== QuestionType.Mcq) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={<FileQuestion size={24} />}
                    title="Question not found"
                    description="The requested question could not be found."
                />
            </div>
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Questions", onClick: () => navigate("/mentor/questions") },
                    { label: "MCQ Questions", onClick: handleBack },
                    { label: question.title },
                ]}
            />

            <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-2xl bg-[var(--cs-surface)] ring-1 ring-inset ring-[var(--cs-border)]/60">
                <div className="border-b border-[var(--cs-border)]/60 p-6">
                    <QuestionDetailHeader
                        question={question}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPublish={handlePublish}
                        publishing={publishing}
                    />
                </div>

                <div className="px-6">
                    <QuestionTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

                    {activeTab === "overview" && <OverviewTab question={question} />}
                    {activeTab === "options" && <McqOptionsSection questionId={question.id} />}
                    {activeTab === "discussion" && (
                        <div className="py-6">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-[var(--cs-text)]">Discussions</h2>
                                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">Ask questions, share approaches, and discuss this MCQ.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCreatingDiscussion((value) => !value)}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--cs-primary)] px-3.5 py-2 text-sm font-semibold text-[var(--cs-primary-contrast)] transition hover:bg-[var(--cs-primary-hover)]"
                                >
                                    <MessageSquarePlus size={16} />
                                    New Discussion
                                </button>
                            </div>

                            {creatingDiscussion && (
                                <div className="mb-6 rounded-xl border border-[var(--cs-border)]/60 bg-[var(--cs-surface-muted)] p-4">
                                    <DiscussionForm
                                        submitLabel="Post Discussion"
                                        submittingLabel="Posting..."
                                        onCancel={() => setCreatingDiscussion(false)}
                                        onSubmit={handleCreateDiscussion}
                                    />
                                </div>
                            )}

                            <DiscussionList
                                discussions={discussions}
                                isLoading={discussionsLoading}
                                isError={discussionsError}
                                currentUserId={currentUserId}
                                fetchComments={getDiscussionComments}
                                onCreateComment={handleCreateComment}
                                onReplyComment={handleReplyComment}
                                onEditComment={handleEditComment}
                                onDeleteComment={handleDeleteComment}
                                onEditDiscussion={handleEditDiscussion}
                                onDeleteDiscussion={handleDeleteDiscussion}
                                renderExtraAction={(discussion) => (
                                    <PinToggleButton
                                        isPinned={discussion.isPinned}
                                        onToggle={() => void handleTogglePin(discussion)}
                                    />
                                )}
                                renderContextSlot={(discussion) => (
                                    <span className="text-[var(--cs-text-muted)]">Question #{discussion.questionId}</span>
                                )}
                                emptyTitle="No discussions"
                                emptyDescription="There are no discussions for this MCQ yet."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default McqQuestionDetailsPage;
