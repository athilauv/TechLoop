import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    CircleDot,
    FileCheck2,
    FileQuestion,
    Layers3,
    Loader2,
    Send,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Breadcrumb from "../../../../shared/Breadcrumb.tsx";
import EmptyState from "../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner.tsx";
import Button from "../../../../shared/Button.tsx";
import PendingContributionCard from "../../topic-contribution/components/PendingContributionCard.tsx";

import {
    publishQuestion,
} from "../../../../api/mentorQuestion.api.ts";
import {
    publishSubTopic,
} from "../../../../api/mentorSubTopic.api.ts";
import {
    publishTopic,
} from "../../../../api/mentorTopic.api.ts";
import {
    getMentorPendingCount,
} from "../../../../types/mentorPending.types.ts";
import { MENTOR_PENDING_QUERY_KEY, useMentorPendingQueue } from "../../../../hooks/useMentorPendingQueue.ts";
import { QuestionType } from "../../../../types/enums/question-type.ts";
import type { MentorTopic } from "../../../../types/topic.types.ts";
import type { MentorSubTopic } from "../../../../types/subTopic.types.ts";
import type { MentorQuestion } from "../../../../types/question.types.ts";
import { getErrorMessage } from "../../../../utils/error.utils.ts";
import { showToast } from "../../../../utils/toast.tsx";

interface PendingTopicGroupProps {
    topic: MentorTopic;
    subTopics: MentorSubTopic[];
    questions: MentorQuestion[];
    onPublishTopic: (topicId: number) => Promise<void>;
    onPublishSubTopic: (subTopicId: number) => Promise<void>;
    onPublishQuestion: (questionId: number) => Promise<void>;
    onPublishAll: (topic: MentorTopic) => Promise<void>;
    publishingId: string | null;
}

function PendingTopicGroup({
    topic,
    subTopics,
    questions,
    onPublishTopic,
    onPublishSubTopic,
    onPublishQuestion,
    onPublishAll,
    publishingId,
}: PendingTopicGroupProps) {
    const [open, setOpen] = useState(true);
    const topicPending = !topic.publishedAt;
    const pendingSubTopics = subTopics.filter((subTopic) => !subTopic.publishedAt);
    const pendingQuestions = questions.filter((question) => !question.publishedAt);
    const pendingCount =
        (topicPending ? 1 : 0) +
        pendingSubTopics.length +
        pendingQuestions.length;

    if (pendingCount === 0) {
        return null;
    }

    return (
        <section className="overflow-hidden rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] px-5 py-4">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="flex min-w-0 items-center gap-3 text-left"
                    aria-expanded={open}
                >
                    {open ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[var(--cs-text-primary)]">
                            {topic.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--cs-text-muted)]">
                            {pendingCount} item{pendingCount !== 1 ? "s" : ""} awaiting publication
                        </span>
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--cs-warning)]">
                        Pending
                    </span>

                    {pendingCount > 1 && (
                        <Button
                            type="button"
                            size="sm"
                            disabled={publishingId !== null}
                            onClick={() => void onPublishAll(topic)}
                            icon={
                                publishingId === `topic-all-${topic.id}` ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )
                            }
                        >
                            Publish All
                        </Button>
                    )}
                </div>
            </div>

            {open && (
                <div className="divide-y divide-[var(--cs-border)]">
                    {topicPending && (
                        <PendingPublishRow
                            icon={<Layers3 size={16} />}
                            label="Topic"
                            title={topic.title}
                            description="Publish this topic to make it available in the learner curriculum."
                            onPublish={() => onPublishTopic(topic.id)}
                            publishing={publishingId === `topic-${topic.id}`}
                            disabled={publishingId !== null}
                        />
                    )}

                    {subTopics.map((subTopic) => (
                        <PendingSubTopicRow
                            key={subTopic.id}
                            subTopic={subTopic}
                            questions={questions.filter(
                                (question) => question.subTopicId === subTopic.id,
                            )}
                            onPublishSubTopic={onPublishSubTopic}
                            onPublishQuestion={onPublishQuestion}
                            publishingId={publishingId}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

interface PendingSubTopicRowProps {
    subTopic: MentorSubTopic;
    questions: MentorQuestion[];
    onPublishSubTopic: (subTopicId: number) => Promise<void>;
    onPublishQuestion: (questionId: number) => Promise<void>;
    publishingId: string | null;
}

function PendingSubTopicRow({
    subTopic,
    questions,
    onPublishSubTopic,
    onPublishQuestion,
    publishingId,
}: PendingSubTopicRowProps) {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const pendingSubTopic = !subTopic.publishedAt;
    const pendingQuestions = questions.filter((question) => !question.publishedAt);

    if (!pendingSubTopic && pendingQuestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-[var(--cs-bg-card)]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 pl-12">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="flex min-w-0 items-center gap-2 text-left"
                    aria-expanded={open}
                >
                    {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    <CircleDot size={12} className="text-[var(--cs-accent)]" />
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[var(--cs-text-primary)]">
                            {subTopic.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--cs-text-muted)]">
                            {pendingQuestions.length} pending question
                            {pendingQuestions.length !== 1 ? "s" : ""}
                            {pendingSubTopic ? " + unpublished subtopic" : ""}
                        </span>
                    </span>
                </button>

                {pendingSubTopic && (
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={publishingId !== null}
                        onClick={() => void onPublishSubTopic(subTopic.id)}
                        icon={
                            publishingId === `subtopic-${subTopic.id}` ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )
                        }
                    >
                        Publish
                    </Button>
                )}
            </div>

            {open && pendingQuestions.length > 0 && (
                <div className="space-y-2 px-5 pb-4 pl-20">
                    {pendingQuestions.map((question) => {
                        const isCoding = question.questionType === QuestionType.Coding;
                        const questionTypeLabel = isCoding
                            ? "Coding"
                            : question.questionType === QuestionType.Mcq
                                ? "MCQ"
                                : "Challenge";
                        const targetPath = isCoding
                            ? `/mentor/questions/coding/${question.id}?tab=templates`
                            : `/mentor/questions/mcq/${question.id}?tab=options`;

                        return (
                            <div
                                key={question.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate(targetPath)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        navigate(targetPath);
                                    }
                                }}
                                className="group cursor-pointer rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-4 py-4 transition hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent)]/40"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg-card)] text-[var(--cs-accent)]">
                                            <FileQuestion size={17} />
                                        </span>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-[var(--cs-text-primary)]">
                                                    {question.title}
                                                </p>
                                                <span className="rounded-full border border-[var(--cs-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--cs-text-muted)]">
                                                    {questionTypeLabel}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--cs-text-secondary)]">
                                                {question.description || "No description available."}
                                            </p>
                                            <p className="mt-2 text-[11px] text-[var(--cs-text-muted)]">
                                                Position {question.position} · Pending publication
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            disabled={publishingId !== null}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                void onPublishQuestion(question.id);
                                            }}
                                            icon={
                                                publishingId === `question-${question.id}` ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Send size={14} />
                                                )
                                            }
                                        >
                                            Publish
                                        </Button>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--cs-border)] text-[var(--cs-text-muted)] transition group-hover:border-[var(--cs-accent-border)] group-hover:text-[var(--cs-accent)]">
                                            <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-3 border-t border-[var(--cs-border)] pt-3 text-[11px] text-[var(--cs-text-muted)]">
                                    {isCoding
                                        ? "Open the question setup to manage coding templates and test cases before publishing."
                                        : "Open the question setup to manage MCQ options before publishing."}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

interface PendingPublishRowProps {
    icon: ReactNode;
    label: string;
    title: string;
    description: string;
    onPublish: () => Promise<void>;
    publishing: boolean;
    disabled: boolean;
}

function PendingPublishRow({
    icon,
    label,
    title,
    description,
    onPublish,
    publishing,
    disabled,
}: PendingPublishRowProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 pl-12">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg-input)] text-[var(--cs-text-muted)]">
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-text-muted)]">
                        {label}
                    </p>
                    <p className="truncate text-sm font-medium text-[var(--cs-text-primary)]">
                        {title}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--cs-text-secondary)]">
                        {description}
                    </p>
                </div>
            </div>

            <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={disabled}
                onClick={() => void onPublish()}
                icon={publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            >
                Publish
            </Button>
        </div>
    );
}

export default function MentorPendingPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, refetch } = useMentorPendingQueue();
    const [publishingId, setPublishingId] = useState<string | null>(null);

    const topicMap = useMemo(() => {
        const map = new Map<number, MentorTopic>();
        data?.allTopics.forEach((topic) => map.set(topic.id, topic));
        return map;
    }, [data?.allTopics]);

    const grouped = useMemo(() => {
        if (!data) {
            return [];
        }

        const pendingTopicIds = new Set(data.unpublishedTopics.map((topic) => topic.id));
        const topicIds = new Set<number>(pendingTopicIds);

        data.unpublishedSubTopics.forEach((subTopic) => topicIds.add(subTopic.topicId));

        data.unpublishedQuestions.forEach((question) => {
            const subTopic = data.allSubTopics.find((item) => item.id === question.subTopicId);
            if (subTopic) {
                topicIds.add(subTopic.topicId);
            }
        });

        return Array.from(topicIds)
            .map((topicId) => {
                const topic = topicMap.get(topicId);
                if (!topic) {
                    return null;
                }

                const allTopicSubTopics = data.allSubTopics
                    .filter((subTopic) => subTopic.topicId === topicId)
                    .sort((a, b) => a.position - b.position);

                const allTopicQuestions = data.unpublishedQuestions.filter((question) =>
                    allTopicSubTopics.some((subTopic) => subTopic.id === question.subTopicId),
                );

                return {
                    topic,
                    subTopics: allTopicSubTopics,
                    questions: allTopicQuestions,
                };
            })
            .filter(
                (
                    value,
                ): value is {
                    topic: MentorTopic;
                    subTopics: MentorSubTopic[];
                    questions: MentorQuestion[];
                } => value !== null,
            )
            .sort((a, b) => a.topic.position - b.topic.position);

        // Keep the maps above explicit so this grouping remains easy to extend
        // when nested curriculum levels are introduced.
    }, [data, topicMap]);

    const publishAndRefresh = async (
        key: string,
        action: () => Promise<unknown>,
        successMessage: string,
    ) => {
        try {
            setPublishingId(key);
            await action();
            await queryClient.invalidateQueries({ queryKey: MENTOR_PENDING_QUERY_KEY });
            showToast.success(successMessage);
        } catch (error) {
            showToast.error(getErrorMessage(error, "Unable to publish item."));
        } finally {
            setPublishingId(null);
        }
    };

    const handlePublishTopic = async (topicId: number) => {
        const confirmed = await new Promise<boolean>((resolve) => {
            showToast.confirm(
                "Publish topic",
                "Publishing makes this topic visible in the learner curriculum. Continue?",
                () => resolve(true),
                () => resolve(false),
                "Publish",
            );
        });
        if (!confirmed) return;

        return publishAndRefresh(
            `topic-${topicId}`,
            () => publishTopic(topicId),
            "Topic published successfully.",
        );
    };

    const handlePublishSubTopic = async (subTopicId: number) => {
        const confirmed = await new Promise<boolean>((resolve) => {
            showToast.confirm(
                "Publish subtopic",
                "Publishing makes this subtopic visible in the learner curriculum. Continue?",
                () => resolve(true),
                () => resolve(false),
                "Publish",
            );
        });
        if (!confirmed) return;

        return publishAndRefresh(
            `subtopic-${subTopicId}`,
            () => publishSubTopic(subTopicId),
            "SubTopic published successfully.",
        );
    };

    const handlePublishQuestion = async (questionId: number) => {
        const confirmed = await new Promise<boolean>((resolve) => {
            showToast.confirm(
                "Publish question",
                "Publishing makes this question available to learners. Continue?",
                () => resolve(true),
                () => resolve(false),
                "Publish",
            );
        });
        if (!confirmed) return;

        return publishAndRefresh(
            `question-${questionId}`,
            () => publishQuestion(questionId),
            "Question published successfully.",
        );
    };

    const handlePublishAll = async (topic: MentorTopic) => {
        if (!data) {
            return;
        }

        const confirmed = await new Promise<boolean>((resolve) => {
            showToast.confirm(
                "Publish all pending content",
                `This will publish the pending content under "${topic.title}". Continue?`,
                () => resolve(true),
                () => resolve(false),
                "Publish all",
            );
        });
        if (!confirmed) return;

        try {
            setPublishingId(`topic-all-${topic.id}`);

            if (!topic.publishedAt) {
                await publishTopic(topic.id);
            }

            const subTopics = data.allSubTopics
                .filter((subTopic) => subTopic.topicId === topic.id)
                .sort((a, b) => a.position - b.position);

            for (const subTopic of subTopics) {
                if (!subTopic.publishedAt) {
                    await publishSubTopic(subTopic.id);
                }

                const questions = data.unpublishedQuestions
                    .filter((question) => question.subTopicId === subTopic.id)
                    .sort((a, b) => a.position - b.position);

                for (const question of questions) {
                    await publishQuestion(question.id);
                }
            }

            await queryClient.invalidateQueries({ queryKey: MENTOR_PENDING_QUERY_KEY });
            showToast.success(`Published pending content under "${topic.title}".`);
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    `Some content under "${topic.title}" could not be published.`,
                ),
            );
        } finally {
            setPublishingId(null);
        }
    };

    const totalPending = getMentorPendingCount(data);

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 py-5">
                <Breadcrumb items={[{ label: "Mentor" }, { label: "Pending" }]} />

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--cs-text-primary)]">
                            Pending
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Review learner contributions and publish mentor-managed content before it reaches learners.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-card)] px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cs-text-muted)]">
                            Action items
                        </p>
                        <p className="mt-1 text-xl font-semibold text-[var(--cs-text-primary)]">
                            {totalPending}
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">
                {isLoading ? (
                    <LoadingSpinner size="lg" label="Loading pending items..." fullHeight />
                ) : isError || !data ? (
                    <EmptyState
                        icon={<FileCheck2 size={24} />}
                        title="Unable to load pending items"
                        description="The pending queue could not be loaded. Please try again."
                        action={
                            <Button type="button" variant="secondary" onClick={() => void refetch()}>
                                Try Again
                            </Button>
                        }
                    />
                ) : totalPending === 0 ? (
                    <EmptyState
                        icon={<CheckCircle2 size={24} />}
                        title="Everything is up to date"
                        description="There are no learner contributions awaiting review and no unpublished topics, subtopics, or questions."
                    />
                ) : (
                    <div className="mx-auto max-w-5xl space-y-8">
                        {data.pendingContributions.length > 0 && (
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <FileCheck2 size={17} className="text-[var(--cs-accent)]" />
                                    <div>
                                        <h2 className="text-sm font-semibold text-[var(--cs-text-primary)]">
                                            Learner Contributions
                                        </h2>
                                        <p className="text-xs text-[var(--cs-text-muted)]">
                                            Awaiting mentor review
                                        </p>
                                    </div>
                                    <span className="ml-auto rounded-full border border-[var(--cs-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--cs-text-muted)]">
                                        {data.pendingContributions.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {data.pendingContributions.map((contribution) => (
                                        <PendingContributionCard
                                            key={contribution.id}
                                            contribution={contribution}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {grouped.length > 0 && (
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <BookOpen size={17} className="text-[var(--cs-accent)]" />
                                    <div>
                                        <h2 className="text-sm font-semibold text-[var(--cs-text-primary)]">
                                            Content to Publish
                                        </h2>
                                        <p className="text-xs text-[var(--cs-text-muted)]">
                                            Topics, subtopics, and questions not yet visible to learners
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {grouped.map((group) => (
                                        <PendingTopicGroup
                                            key={group.topic.id}
                                            topic={group.topic}
                                            subTopics={group.subTopics}
                                            questions={group.questions}
                                            onPublishTopic={handlePublishTopic}
                                            onPublishSubTopic={handlePublishSubTopic}
                                            onPublishQuestion={handlePublishQuestion}
                                            onPublishAll={handlePublishAll}
                                            publishingId={publishingId}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
