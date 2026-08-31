import { useState } from "react";
import { Code2, MessageSquarePlus } from "lucide-react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import Button from "../../../../../shared/Button.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";

import {
    deleteQuestion,
    getMentorQuestionBySlug,
    publishQuestion,
} from "../../../../../api/mentorQuestion.api.ts";
import { MENTOR_PENDING_QUERY_KEY } from "../../../../../hooks/useMentorPendingQueue.ts";

import {
    getMentorDiscussions,
    pinDiscussion,
    unpinDiscussion,
} from "../../../../../api/mentorDiscussion.api.ts";

import {
    createDiscussion,
    createDiscussionComment,
    deleteDiscussion,
    deleteDiscussionComment,
    getDiscussionComments,
    updateDiscussion,
    updateDiscussionComment,
} from "../../../../../api/discussion.api.ts";

import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import { QuestionType } from "../../../../../types/enums/question-type.ts";

import type {
    MentorQuestion,
} from "../../../../../types/question.types.ts";

import type {
    Discussion,
    DiscussionComment,
} from "../../../../../types/discussion.types.ts";

import {
    useCurrentUserId,
} from "../../../../../hooks/useCurrentUserId.ts";

import QuestionDetailHeader from "../../components/question-details/QuestionDetailHeader.tsx";
import QuestionTabs from "../../components/question-details/QuestionTabs.tsx";
import OverviewTab from "../../components/question-details/OverviewTab.tsx";
import CodingTemplatesSection from "../../components/coding/CodingTemplatesSection.tsx";
import TestCasesSection from "../../components/coding/TestCasesSection.tsx";
import DiscussionList from "../../../../common/Discussion/components/DiscussionList.tsx";
import DiscussionForm from "../../../../common/Discussion/components/DiscussionForm.tsx";
import PinToggleButton from "../../components/discussions/PinToggleButton.tsx";

const TABS = [
    {
        key: "overview",
        label: "Overview",
    },
    {
        key: "templates",
        label: "Templates",
    },
    {
        key: "test-cases",
        label: "Test Cases",
    },
    {
        key: "discussion",
        label: "Discussion",
    },
];

const CodingQuestionDetailsPage = () => {
    const { slug } = useParams<{ slug: string }>();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const queryClient = useQueryClient();

    const currentUserId = useCurrentUserId();

    const requestedTab = searchParams.get("tab");

    const validInitialTabs = new Set(
        TABS.map((tab) => tab.key),
    );

    const initialTab =
        requestedTab &&
        validInitialTabs.has(requestedTab)
            ? requestedTab
            : "overview";

    const [activeTab, setActiveTab] =
        useState(initialTab);

    const [publishing, setPublishing] =
        useState(false);

    const [creatingDiscussion, setCreatingDiscussion] =
        useState(false);

    const questionSlug = slug ?? "";
    const validQuestionSlug =
        Boolean(questionSlug.trim());

    const {
        data: question,
        isLoading,
        isError,
        refetch,
    } = useQuery<MentorQuestion>({
        queryKey: [
            "mentor-question",
            questionSlug,
        ],
        queryFn: () =>
            getMentorQuestionBySlug(questionSlug),
        enabled: validQuestionSlug,
    });

    /*
     * question.id is already available from React Query.
     * No extra state or useEffect is required.
     */
    const questionId = question?.id ?? 0;

    const {
        data: discussions = [],
        isLoading: discussionsLoading,
        isError: discussionsError,
    } = useQuery<Discussion[]>({
        queryKey: [
            "mentor-discussions",
            questionId,
        ],
        queryFn: getMentorDiscussions,
        enabled:
            questionId > 0 &&
            activeTab === "discussion",
    });

    const questionDiscussions =
        discussions.filter(
            (discussion) =>
                discussion.questionId ===
                questionId,
        );

    const invalidateDiscussions =
        async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "mentor-discussions",
                ],
            });
        };

    const handleCreateDiscussion =
        async (
            title: string,
            content: string,
        ): Promise<void> => {
            try {
                await createDiscussion({
                    questionId,
                    title,
                    content,
                });

                showToast.success(
                    "Discussion created successfully.",
                );

                setCreatingDiscussion(false);

                await invalidateDiscussions();
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to create discussion.",
                    ),
                );

                throw error;
            }
        };

    const handleEditDiscussion =
        async (
            discussion: Discussion,
            title: string,
            content: string,
        ): Promise<void> => {
            try {
                await updateDiscussion({
                    id: discussion.id,
                    title,
                    content,
                });

                showToast.success(
                    "Discussion updated successfully.",
                );

                await invalidateDiscussions();
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to update discussion.",
                    ),
                );

                throw error;
            }
        };

    const handleDeleteDiscussion =
        async (
            discussion: Discussion,
        ): Promise<void> => {
            showToast.confirm(
                "Delete Discussion",
                "Are you sure you want to delete this discussion? This action cannot be undone.",
                () => {
                    void (async () => {
                        try {
                            await deleteDiscussion(
                                discussion.id,
                            );

                            showToast.success(
                                "Discussion deleted successfully.",
                            );

                            try {
                                await invalidateDiscussions();
                            } catch (refreshError) {
                                console.error(
                                    "Failed to refresh discussions after deletion:",
                                    refreshError,
                                );
                            }
                        } catch (error) {
                            showToast.error(
                                getErrorMessage(
                                    error,
                                    "Failed to delete discussion.",
                                ),
                            );
                        }
                    })();
                },
                undefined,
                "Delete",
            );
        };

    const handleCreateComment =
        async (
            discussion: Discussion,
            content: string,
        ): Promise<void> => {
            try {
                await createDiscussionComment(
                    discussion.id,
                    {
                        content,
                        parentCommentId: null,
                    },
                );

                await invalidateDiscussions();
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to post comment.",
                    ),
                );

                throw error;
            }
        };

    const handleReplyComment =
        async (
            discussion: Discussion,
            comment: DiscussionComment,
            content: string,
        ): Promise<void> => {
            try {
                await createDiscussionComment(
                    discussion.id,
                    {
                        content,
                        parentCommentId:
                        comment.id,
                    },
                );

                await invalidateDiscussions();
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to post reply.",
                    ),
                );

                throw error;
            }
        };

    const handleEditComment =
        async (
            _discussion: Discussion,
            comment: DiscussionComment,
            content: string,
        ): Promise<void> => {
            try {
                await updateDiscussionComment(
                    comment.id,
                    {
                        content,
                    },
                );

                await invalidateDiscussions();

                showToast.success(
                    "Comment updated successfully.",
                );
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to update comment.",
                    ),
                );

                throw error;
            }
        };

    const handleDeleteComment =
        async (
            _discussion: Discussion,
            comment: DiscussionComment,
        ): Promise<void> => {
            try {
                await deleteDiscussionComment(
                    comment.id,
                );

                showToast.success(
                    "Comment deleted successfully.",
                );

                try {
                    await invalidateDiscussions();
                } catch (refreshError) {
                    console.error(
                        "Failed to refresh discussions after comment deletion:",
                        refreshError,
                    );
                }
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete comment.",
                    ),
                );

                throw error;
            }
        };

    const handleTogglePin =
        async (
            discussion: Discussion,
        ) => {
            try {
                if (discussion.isPinned) {
                    await unpinDiscussion(
                        discussion.id,
                    );

                    showToast.success(
                        "Discussion unpinned.",
                    );
                } else {
                    await pinDiscussion(
                        discussion.id,
                    );

                    showToast.success(
                        "Discussion pinned.",
                    );
                }

                await invalidateDiscussions();
            } catch (error) {
                showToast.error(
                    getErrorMessage(
                        error,
                        "Failed to update pin status.",
                    ),
                );
            }
        };

    const handleBack = () => {
        navigate("/mentor/questions/coding",);
    };

    const handleEdit = () => {
        if (question) {
            navigate(`/mentor/questions/coding/${question.slug}/edit`,);
        }
    };

    const handlePublish = () => {
        if (!question) return;

        showToast.confirm(
            "Publish Coding Question",
            "Are you sure you want to publish this coding question?",
            () => {
                void (async () => {
                    setPublishing(true);

                    try {
                        await publishQuestion(question.id,);
                        await queryClient.invalidateQueries(
                            {
                                queryKey: ["mentor-question", questionSlug],
                            },
                        );

                        await queryClient.invalidateQueries(
                            {
                                queryKey: ["mentor-questions"],
                            },
                        );

                        await queryClient.invalidateQueries(
                            {
                                queryKey:
                                MENTOR_PENDING_QUERY_KEY,
                            },
                        );

                        showToast.success("Coding question published successfully.",);
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(error, "Failed to publish coding question."),);
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

        showToast.confirm("Delete Coding Question", "Are you sure you want to delete this coding question? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteQuestion(question.id,);
                        showToast.success("Coding question deleted successfully.",);
                        queryClient.removeQueries({
                            queryKey: ["mentor-question", questionSlug,],
                        });

                        try {
                            await queryClient.invalidateQueries(
                                {
                                    queryKey: ["mentor-questions",],
                                },
                            );
                        } catch (refreshError) {
                            console.error("Failed to refresh mentor questions after deletion:", refreshError,);
                        }

                        navigate("/mentor/questions/coding",);
                    } catch (error) {
                        showToast.error(getErrorMessage(error, "Failed to delete coding question.",),);
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    if (!validQuestionSlug) {
        return (
            <PageMessage
                title="Invalid Question"
                message="The coding question slug is invalid."
                actionLabel="Back to Coding Questions"
                onAction={handleBack}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !question) {
        return (
            <PageMessage
                title="Unable to Load Question"
                message="The coding question could not be loaded."
                actionLabel="Retry"
                onAction={() => void refetch()}
                secondaryActionLabel="Back to Coding Questions"
                onSecondaryAction={handleBack}/>
        );
    }

    if (question.questionType !== QuestionType.Coding) {
        return (
            <PageMessage
                title="Invalid Question Type"
                message="This question is not a coding question."
                actionLabel="Back to Coding Questions"
                onAction={handleBack}
            />
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    {
                        label: "Questions",
                        onClick: () =>
                            navigate("/mentor/questions",),
                    },
                    {
                        label: "Coding Questions",
                        onClick: () =>
                            navigate("/mentor/questions/coding",),
                    },
                    {
                        label:
                        question.title,
                    },
                ]}
            />

            <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-2xl bg-[var(--cs-surface)] ring-1 ring-inset ring-[var(--cs-border)]/60">
                <section className="border-b border-[var(--cs-border)]/60 p-6">
                    <QuestionDetailHeader
                        question={question}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPublish={handlePublish}
                        publishing={publishing}/>
                </section>

                <div className="px-6">
                    <QuestionTabs tabs={TABS} active={activeTab} onChange={setActiveTab}/>
                    {activeTab === "overview" && (<OverviewTab question={question}/>)}
                    {activeTab === "templates" && (<CodingTemplatesSection questionId={question.id}/>)}
                    {activeTab === "test-cases" && (<TestCasesSection questionId={question.id}/>)}
                    {activeTab === "discussion" && (
                            <div className="py-6">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-base font-semibold text-[var(--cs-text)]">
                                            Discussions
                                        </h2>

                                        <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                                            Ask questions, share approaches, and discuss this coding question.
                                        </p>
                                    </div>

                                    {!creatingDiscussion && (
                                        <button
                                            type="button"
                                            onClick={() => setCreatingDiscussion(true,)}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--cs-primary,#00C9A7)] bg-[var(--cs-primary,#00C9A7)] px-3.5 py-2 text-sm font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)]">
                                            <MessageSquarePlus size={16}/>
                                            New Discussion
                                        </button>
                                    )}
                                </div>

                                {creatingDiscussion && (
                                    <div className="mb-6 rounded-xl border border-[var(--cs-border)]/60 bg-[var(--cs-surface)]/50 p-5 backdrop-blur-sm">
                                        <h3 className="mb-3 text-sm font-semibold text-[var(--cs-text)]">
                                            Start a new discussion
                                        </h3>

                                        <DiscussionForm
                                            submitLabel="Post Discussion"
                                            submittingLabel="Posting..."
                                            onCancel={() =>
                                                setCreatingDiscussion(
                                                    false,
                                                )
                                            }
                                            onSubmit={
                                                handleCreateDiscussion
                                            }
                                        />
                                    </div>
                                )}

                                <DiscussionList
                                    discussions={questionDiscussions}
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
                                    renderExtraAction={(discussion,) => (
                                        <PinToggleButton
                                            isPinned={discussion.isPinned}
                                            onToggle={() => void handleTogglePin(discussion,)}
                                        />
                                    )}
                                    renderContextSlot={(
                                        discussion,
                                    ) => (
                                        <span className="text-[var(--cs-text-muted)]">
                                        Question #{discussion.questionId}
                                    </span>
                                    )}
                                    emptyTitle="No discussions"
                                    emptyDescription="There are no discussions for this coding question yet."
                                />
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

interface PageMessageProps {
    title: string;
    message: string;
    actionLabel: string;
    onAction: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}

const PageMessage = ({
                         title,
                         message,
                         actionLabel,
                         onAction,
                         secondaryActionLabel,
                         onSecondaryAction,
                     }: PageMessageProps) => {
    return (
        <div className="min-h-full px-6 py-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-2xl bg-[var(--cs-surface)] px-6 py-16 text-center ring-1 ring-inset ring-[var(--cs-border)]/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cs-primary)]/12 text-[var(--cs-primary)]">
                    <Code2 size={22} />
                </div>

                <h1 className="mt-4 text-lg font-semibold text-[var(--cs-text)]">
                    {title}
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--cs-text-muted)]">
                    {message}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Button type="button" onClick={onAction}>
                        {actionLabel}
                    </Button>

                    {secondaryActionLabel &&
                        onSecondaryAction && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onSecondaryAction}>
                                {secondaryActionLabel}
                            </Button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default CodingQuestionDetailsPage;