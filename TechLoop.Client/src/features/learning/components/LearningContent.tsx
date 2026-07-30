import { BookOpen, CalendarDays, ChevronRight, Layers, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Technology } from "../types/Technology";
import type { Topic } from "../types/Topic";
import type { SubTopic } from "../types/SubTopic";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { toParagraphs, formatDate } from "../utils/content";
import LessonNavigation from "../../../shared/components/common/navigation/LessonNavigation";
import EmptyState from "../../../shared/components/common/feedback/EmptyState";

interface IntroductionViewProps {
    mode: "introduction";
    technology: Technology;
    topicCount: number;
    onStartLearning: () => void;
}

interface TopicViewProps {
    mode: "topic";
    technology: Technology;
    topic: Topic;
    subTopics: SubTopic[];
    previousTopic: Topic | null;
    nextTopic: Topic | null;
    onPreviousTopic: () => void;
    onNextTopic: () => void;
    onActiveSectionChange: (slug: string) => void;
}

type LearningContentProps = IntroductionViewProps | TopicViewProps;

function Prose({ text }: { text: string | null | undefined }) {
    const paragraphs = toParagraphs(text);

    if (paragraphs.length === 0) {
        return (
            <p className="text-lg leading-9 text-[#5C7394] italic">
                Content for this section hasn't been added yet.
            </p>
        );
    }

    return (
        <div className="space-y-5 text-lg leading-9 text-[#8CA3BF]">
            {paragraphs.map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                    {paragraph}
                </p>
            ))}
        </div>
    );
}

export default function LearningContent(props: LearningContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    if (props.mode === "introduction") {
        return <IntroductionView {...props} />;
    }

    return <TopicView {...props} contentRef={contentRef} />;
}

function IntroductionView({ technology, topicCount, onStartLearning }: IntroductionViewProps) {
    const updated = formatDate(technology.updatedAt ?? technology.createdAt);

    return (
        <main className="flex-1 overflow-y-auto bg-[#0E192A]">
            <div className="mx-auto max-w-3xl px-12 py-10">
                <div className="mb-3 flex items-center gap-2 text-[#00E8C2]">
                    <BookOpen size={18} strokeWidth={1.75} />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Introduction</span>
                </div>

                <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
                    Introduction to {technology.name}
                </h1>

                {/* Introduction card */}
                <div className="mb-10 flex items-center gap-6 rounded-2xl border border-[#223A59] bg-[#14243C] p-8">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#00E8C2]/15 overflow-hidden">
                        {technology.imageUrl ? (
                            <img src={technology.imageUrl} alt={technology.name} className="h-10 w-10 object-contain" />
                        ) : (
                            <BookOpen size={28} className="text-[#00E8C2]" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white">{technology.name}</h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#8CA3BF]">
                            <span className="flex items-center gap-1.5">
                                <Layers size={15} className="text-[#5C7394]" />
                                {topicCount} {topicCount === 1 ? "Topic" : "Topics"}
                            </span>

                            {updated && (
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays size={15} className="text-[#5C7394]" />
                                    Last updated · {updated}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Prose text={technology.description} />

                <button
                    onClick={onStartLearning}
                    disabled={topicCount === 0}
                    className="mt-12 flex items-center gap-2 rounded-xl bg-[#00E8C2] px-6 py-3 font-semibold text-[#081423] transition hover:bg-[#00DDB9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Start Learning
                    <ArrowRight size={18} />
                </button>
            </div>
        </main>
    );
}

function TopicView({
                       technology,
                       topic,
                       subTopics,
                       previousTopic,
                       nextTopic,
                       onPreviousTopic,
                       onNextTopic,
                       onActiveSectionChange,
                       contentRef,
                   }: TopicViewProps & { contentRef: React.RefObject<HTMLDivElement | null> }) {
    const sectionIds = subTopics.map((s) => s.slug);
    const activeId = useScrollSpy(contentRef, sectionIds, { enabled: sectionIds.length > 0 });

    useEffect(() => {
        if (activeId) {
            onActiveSectionChange(activeId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId]);

    const updated = formatDate(topic.updatedAt ?? topic.createdAt);

    return (
        <main className="flex-1 overflow-hidden bg-[#0E192A]">
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-[#223A59] bg-[#0E192A] px-10 py-8">
                    <div className="mb-3 flex items-center gap-2 text-[#00E8C2]">
                        <BookOpen size={18} strokeWidth={1.75} />
                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">Learning Content</span>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm text-[#8CA3BF]">
                        <span>{technology.name}</span>
                        <ChevronRight size={14} className="text-[#5C7394]" />
                        <span className="text-white">{topic.title}</span>
                    </div>

                    {updated && (
                        <div className="mb-5 flex items-center gap-2 text-sm text-[#8CA3BF]">
                            <CalendarDays size={16} strokeWidth={1.75} />
                            <span>Last updated · {updated}</span>
                        </div>
                    )}

                    <h1 className="text-4xl font-bold tracking-tight text-white">{topic.title}</h1>
                </div>

                {/* Scrollable body */}
                <div ref={contentRef} className="flex-1 overflow-y-auto">
                    <div className="w-full px-12 py-10">
                        {topic.imageUrl && (
                            <div className="mb-10 overflow-hidden rounded-2xl border border-[#223A59]">
                                <img src={topic.imageUrl} alt={topic.title} className="w-full object-cover" />
                            </div>
                        )}

                        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-8">
                            <Prose text={topic.description} />
                        </div>

                        {subTopics.length === 0 ? (
                            <div className="mt-10">
                                <EmptyState
                                    title="No lessons yet"
                                    description="This topic doesn't have any subtopics published yet."
                                />
                            </div>
                        ) : (
                            <div className="mt-10 space-y-10">
                                {subTopics.map((subTopic) => {
                                    const subUpdated = formatDate(subTopic.updatedAt ?? subTopic.createdAt);

                                    return (
                                        <section
                                            key={subTopic.id}
                                            id={subTopic.slug}
                                            className="scroll-mt-6 border-t border-[#223A59] pt-10 first:border-t-0 first:pt-0"
                                        >
                                            <h2 className="mb-3 text-2xl font-semibold text-white">
                                                {subTopic.title}
                                            </h2>

                                            {subUpdated && (
                                                <div className="mb-6 flex items-center gap-2 text-sm text-[#5C7394]">
                                                    <CalendarDays size={14} />
                                                    <span>Last updated · {subUpdated}</span>
                                                </div>
                                            )}

                                            {subTopic.imageUrl && (
                                                <div className="mb-6 overflow-hidden rounded-2xl border border-[#223A59]">
                                                    <img
                                                        src={subTopic.imageUrl}
                                                        alt={subTopic.title}
                                                        className="w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-8">
                                                <Prose text={subTopic.description} />
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        )}

                        <LessonNavigation
                            previousTitle={previousTopic?.title}
                            nextTitle={nextTopic?.title}
                            canGoPrevious={!!previousTopic}
                            canGoNext={!!nextTopic}
                            onPrevious={onPreviousTopic}
                            onNext={onNextTopic}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
