import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
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

/* ---------------------------------------------------------------------- */
/* Small presentational primitives used only by this page                  */
/* ---------------------------------------------------------------------- */

interface SectionTabProps {
    active: boolean;
    icon: ReactNode;
    label: string;
    count: number;
    onClick: () => void;
}

function SectionTab({ active, icon, label, count, onClick }: SectionTabProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative inline-flex items-center gap-2 whitespace-nowrap px-1 pb-3 pt-1
                text-xs font-medium transition
                ${active ? "text-[var(--cs-accent)]" : "text-[var(--cs-text-secondary)] hover:text-[var(--cs-text-primary)]"}
            `}
        >
            {icon}
            {label}
            <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]" : "bg-white/5 text-[var(--cs-text-muted)]"
                }`}
            >
                {count}
            </span>
            {active && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--cs-accent)]" />
            )}
        </button>
    );
}

/* ---------------------------------------------------------------------- */
/* Content-to-publish tree                                                 */
/* ---------------------------------------------------------------------- */

interface PendingTopicGroupProps {
    topic: MentorTopic;
    subTopics: MentorSubTopic[];
    questions: MentorQuestion[];
    onPublishTopic: (topicId: number) => Promise<void>;
    onPublishSubTopic: (subTopicId: number) => Promise<void>;
    onPublishQuestion: (questionId: number) => Promise<boolean>;
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
        <section className="overflow-hidden rounded-lg border-l-2 border-l-[var(--cs-warning)] bg-[var(--cs-bg-card)]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="flex min-w-0 items-center gap-2.5 text-left"
                    aria-expanded={open}
                >
                    <span className="shrink-0 text-[var(--cs-text-muted)]">
                        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </span>
                    <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                            <span className="block truncate text-sm font-semibold text-[var(--cs-text-primary)]">
                                {topic.title}
                            </span>
                            <span className="rounded-full border border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--cs-warning)]">
                                Pending
                            </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--cs-text-muted)]">
                            {pendingCount} item{pendingCount !== 1 ? "s" : ""} awaiting publication
                        </span>
                    </span>
                </button>

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

            {open && (
                <div className="border-t border-[var(--cs-border)] px-4 py-3">
                    <div className="space-y-0.5">
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
                </div>
            )}
        </section>
    );
}

interface PendingSubTopicRowProps {
    subTopic: MentorSubTopic;
    questions: MentorQuestion[];
    onPublishSubTopic: (subTopicId: number) => Promise<void>;
    onPublishQuestion: (questionId: number) => Promise<boolean>;
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
        <div className="rounded-md pl-1">
            <div className="flex flex-wrap items-center justify-between gap-3 py-2">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="flex min-w-0 items-center gap-2 text-left"
                    aria-expanded={open}
                >
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
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
                <div className="ml-5 space-y-1 border-l border-[var(--cs-border)] py-1 pl-4">
                    {pendingQuestions.map((question) => {
                        const isCoding = question.questionType === QuestionType.Coding;
                        const questionTypeLabel = isCoding
                            ? "Coding"
                            : question.questionType === QuestionType.Mcq
                                ? "MCQ"
                                : "Challenge";
                        const targetPath = isCoding
                            ? `/mentor/questions/coding/${question.slug}?tab=templates`
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
                                className="
                                    group grid cursor-pointer grid-cols-1 items-start gap-2 rounded-md px-3 py-2.5
                                    transition hover:bg-[var(--cs-bg-input)]
                                    focus:outline-none focus:ring-2 focus:ring-[var(--cs-accent)]/40
                                    sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3
                                "
                            >
                                <span className="hidden shrink-0 text-[var(--cs-text-muted)] sm:block">
                                    <FileQuestion size={14} />
                                </span>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <FileQuestion size={13} className="text-[var(--cs-text-muted)] sm:hidden" />
                                        <p className="truncate text-sm font-medium text-[var(--cs-text-primary)]">
                                            {question.title}
                                        </p>
                                        <span className="rounded-full border border-[var(--cs-border)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--cs-text-muted)]">
                                            {questionTypeLabel}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-[var(--cs-text-secondary)]">
                                        {question.description || "No description available."}
                                    </p>
                                </div>

                                <span className="hidden text-[10px] text-[var(--cs-text-muted)] sm:block">
                                    Pos. {question.position}
                                </span>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={publishingId !== null}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        void (async () => {
                                            const published = await onPublishQuestion(question.id);
                                            if (published) navigate(targetPath);
                                        })();
                                    }}
                                    icon={
                                        publishingId === `question-${question.id}` ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : (
                                            <Send size={13} />
                                        )
                                    }
                                >
                                    Publish
                                </Button>
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2.5 transition hover:bg-[var(--cs-bg-input)]">
            <div className="flex min-w-0 items-center gap-2.5">
                <span className="shrink-0 text-[var(--cs-text-muted)]">
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-text-muted)]">
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

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function MentorPendingPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, refetch } = useMentorPendingQueue();
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<"contributions" | "content" | null>(null);

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
    ): Promise<void> => {
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

    const handlePublishQuestion = async (questionId: number): Promise<boolean> => {
        const confirmed = await new Promise<boolean>((resolve) => {
            showToast.confirm(
                "Publish question",
                "Publishing makes this question available to learners. Continue?",
                () => resolve(true),
                () => resolve(false),
                "Publish",
            );
        });
        if (!confirmed) return false;

        try {
            setPublishingId(`question-${questionId}`);
            await publishQuestion(questionId);
            await queryClient.invalidateQueries({ queryKey: MENTOR_PENDING_QUERY_KEY });
            showToast.success("Question published successfully.");

            const publishedQuestion = data?.unpublishedQuestions.find((question) => question.id === questionId);
            if (publishedQuestion?.questionType === QuestionType.Coding && publishedQuestion.slug) navigate(`/mentor/questions/coding/${publishedQuestion.slug}`);

            return true;
        } catch (error) {
            showToast.error(getErrorMessage(error, "Unable to publish question."));
            return false;
        } finally {
            setPublishingId(null);
        }
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
    const hasContributions = !!data && data.pendingContributions.length > 0;
    const hasContent = grouped.length > 0;
    const showTabs = hasContributions && hasContent;
    const section = activeSection ?? (hasContributions ? "contributions" : "content");
    const contentCount = data ? totalPending - data.pendingContributions.length : 0;

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 pt-5">
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

                    {!isLoading && !isError && data && totalPending > 0 && (
                        <p className="text-xs text-[var(--cs-text-muted)]">
                            <span className="font-semibold text-[var(--cs-accent)]">{totalPending}</span> total ·{" "}
                            {data.pendingContributions.length} contribution
                            {data.pendingContributions.length !== 1 ? "s" : ""} · {contentCount} content item
                            {contentCount !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                {!isLoading && !isError && data && showTabs && (
                    <div className="mt-5 flex gap-5">
                        <SectionTab
                            active={section === "contributions"}
                            onClick={() => setActiveSection("contributions")}
                            icon={<FileCheck2 size={14} />}
                            label="Learner Contributions"
                            count={data.pendingContributions.length}
                        />
                        <SectionTab
                            active={section === "content"}
                            onClick={() => setActiveSection("content")}
                            icon={<BookOpen size={14} />}
                            label="Content to Publish"
                            count={contentCount}
                        />
                    </div>
                )}
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
                    <div className="mx-auto max-w-5xl">
                        {hasContributions && section === "contributions" && (
                            <section>
                                {!showTabs && (
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
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {data.pendingContributions.map((contribution) => (
                                        <PendingContributionCard
                                            key={contribution.id}
                                            contribution={contribution}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {hasContent && section === "content" && (
                            <section>
                                {!showTabs && (
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
                                )}

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
