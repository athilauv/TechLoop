import { useEffect, useMemo, type Dispatch, type SetStateAction } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BookOpen, Menu } from "lucide-react";
import LearningLayout from "../components/layout/LearningLayout";
import ContentHeader from "../components/content/ContentHeader";
import ContentBody from "../components/content/ContentBody";
import Breadcrumb from "../components/common/Breadcrumb";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useTechnology } from "../../../../hooks/useTechnology.ts";
import { useCurriculum } from "../../../../hooks/useCurriculum.ts";
import { getSubTopicBySlug } from "../../../../api/subTopic.api.ts";
import type { CurriculumSubTopic, CurriculumTopic } from "../../../../types/curriculum.types.ts";

interface CurriculumNode extends CurriculumSubTopic {
    children: CurriculumNode[];
}

function buildSubTopicTree(subTopics: CurriculumSubTopic[]): CurriculumNode[] {
    const nodes = new Map<number, CurriculumNode>();

    for (const subTopic of subTopics) {
        nodes.set(subTopic.id, { ...subTopic, children: [] });
    }

    const roots: CurriculumNode[] = [];

    for (const node of nodes.values()) {
        if (node.parentSubTopicId !== null && nodes.has(node.parentSubTopicId)) {
            nodes.get(node.parentSubTopicId)!.children.push(node);
        } else {
            roots.push(node);
        }
    }

    const sortTree = (items: CurriculumNode[]) => {
        items.sort((a, b) => a.position - b.position);
        for (const item of items) {
            sortTree(item.children);
        }
    };

    sortTree(roots);
    return roots;
}

function flattenSubTopics(subTopics: CurriculumSubTopic[]): CurriculumSubTopic[] {
    const result: CurriculumSubTopic[] = [];

    const visit = (items: CurriculumNode[]) => {
        for (const item of items) {
            result.push(item);
            visit(item.children);
        }
    };

    visit(buildSubTopicTree(subTopics));
    return result;
}

function firstLesson(topic: CurriculumTopic | undefined): CurriculumSubTopic | null {
    if (!topic) return null;
    return flattenSubTopics(topic.subTopics ?? [])[0] ?? null;
}

function lastLesson(topic: CurriculumTopic | undefined): CurriculumSubTopic | null {
    if (!topic) return null;
    const lessons = flattenSubTopics(topic.subTopics ?? []);
    return lessons[lessons.length - 1] ?? null;
}

export default function LearningPage() {
    const { technologySlug, topicSlug, subTopicSlug } = useParams();
    const navigate = useNavigate();
    const {
        learningCurriculumOpen: mobileCurriculumOpen,
        setLearningCurriculumOpen: setMobileCurriculumOpen,
    } = useOutletContext<{
        learningCurriculumOpen: boolean;
        setLearningCurriculumOpen: Dispatch<SetStateAction<boolean>>;
    }>();

    const {
        data: technology,
        isLoading: technologyLoading,
        isError: technologyError,
    } = useTechnology(technologySlug ?? "");

    const technologyId = technology?.id ?? 0;

    const {
        data: curriculum,
        isLoading: curriculumLoading,
        isError: curriculumError,
    } = useCurriculum(technologyId);

    const currentTopic = useMemo(() => {
        if (!curriculum || !topicSlug) return null;
        return curriculum.topics.find((topic) => topic.slug === topicSlug) ?? null;
    }, [curriculum, topicSlug]);

    const lessonNodes = useMemo(
        () => flattenSubTopics(currentTopic?.subTopics ?? []),
        [currentTopic],
    );

    useEffect(() => {
        if (!technologySlug || !curriculum || topicSlug) return;

        const firstTopic = curriculum.topics?.[0];
        const firstSubTopic = firstLesson(firstTopic);

        if (!firstTopic || !firstSubTopic) return;

        navigate(
            `/learner/learning/${technologySlug}/${firstTopic.slug}/${firstSubTopic.slug}`,
            { replace: true },
        );
    }, [technologySlug, curriculum, topicSlug, navigate]);

    const subTopicQueries = useQueries({
        queries: lessonNodes.map((subTopic) => ({
            queryKey: ["subTopic", subTopic.slug],
            queryFn: () => getSubTopicBySlug(subTopic.slug),
            enabled: Boolean(currentTopic),
            retry: 1,
        })),
    });

    // Keep the curriculum's tree order even when individual lesson requests
    // return in a different order. This is important for nested subtopics.
    const subTopics = useMemo(() => {
        return lessonNodes
            .map((lesson, index) => subTopicQueries[index]?.data ?? lesson)
            .filter(Boolean);
    }, [lessonNodes, subTopicQueries]);

    const subTopicsLoading = subTopicQueries.some((query) => query.isLoading);
    const failedQueries = subTopicQueries.filter((query) => query.isError);
    const subTopicsError = failedQueries.length > 0;

    useEffect(() => {
        if (!subTopicSlug || subTopics.length === 0) return;

        const selectedSubTopic = subTopics.find((item) => item.slug === subTopicSlug);
        if (!selectedSubTopic) return;

        const timeout = window.setTimeout(() => {
            const element = document.getElementById(`subtopic-${selectedSubTopic.slug}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);

        return () => window.clearTimeout(timeout);
    }, [subTopicSlug, subTopics]);

    const currentTopicIndex = useMemo(() => {
        if (!curriculum || !currentTopic) return -1;
        return curriculum.topics.findIndex((topic) => topic.id === currentTopic.id);
    }, [curriculum, currentTopic]);

    const previousDestination = useMemo(() => {
        if (!curriculum || currentTopicIndex <= 0 || !technologySlug) return null;

        for (let index = currentTopicIndex - 1; index >= 0; index -= 1) {
            const topic = curriculum.topics[index];
            const lesson = lastLesson(topic);
            if (lesson) {
                return `/learner/learning/${technologySlug}/${topic.slug}/${lesson.slug}`;
            }
        }

        return null;
    }, [curriculum, currentTopicIndex, technologySlug]);

    const nextDestination = useMemo(() => {
        if (!curriculum || currentTopicIndex < 0 || !technologySlug) return null;

        for (let index = currentTopicIndex + 1; index < curriculum.topics.length; index += 1) {
            const topic = curriculum.topics[index];
            const lesson = firstLesson(topic);
            if (lesson) {
                return `/learner/learning/${technologySlug}/${topic.slug}/${lesson.slug}`;
            }
        }

        return null;
    }, [curriculum, currentTopicIndex, technologySlug]);

    const navigateToTopic = (destination: string | null) => {
        if (!destination) return;
        navigate(destination);
        setMobileCurriculumOpen(false);
    };

    if (!technologySlug || !topicSlug) {
        return (
            <LearningLayout>
                <EmptyState
                    icon={<BookOpen className="h-7 w-7" />}
                    title="No lesson selected"
                    description="Pick a topic from the sidebar to start learning."
                />
            </LearningLayout>
        );
    }

    if (technologyLoading || curriculumLoading) {
        return (
            <LearningLayout>
                <div className="space-y-6">
                    <LoadingSkeleton variant="text" lines={2} />
                    <LoadingSkeleton variant="card" />
                </div>
            </LearningLayout>
        );
    }

    if (
        technologyError ||
        curriculumError ||
        !technology ||
        !curriculum ||
        !currentTopic
    ) {
        return (
            <LearningLayout>
                <ErrorState
                    title="Unable to load topic"
                    description="Something went wrong while loading this learning topic."
                />
            </LearningLayout>
        );
    }

    return (
        <LearningLayout onMobileCurriculumChange={setMobileCurriculumOpen} mobileCurriculumOpen={mobileCurriculumOpen}>
            <div className="sticky top-3 z-20 mb-4 flex items-center justify-between gap-3 xl:hidden">
                <button
                    type="button"
                    onClick={() => setMobileCurriculumOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#223A59] bg-[#0E192A] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#14243C]"
                    aria-label="Open curriculum"
                >
                    <Menu className="h-4 w-4 text-[#00E8C2]" />
                    Curriculum
                </button>

                <span className="max-w-[55%] truncate text-xs text-[#5C7394]">
                    {currentTopic.title}
                </span>
            </div>

            <Breadcrumb
                items={[
                    { label: "Learning", href: "/learner/learning" },
                    { label: technology.name, href: `/learner/learning/${technology.slug}` },
                    { label: currentTopic.title },
                ]}
            />

            <div className="mt-4">
                <ContentHeader title={currentTopic.title} />
            </div>

            <div className="mt-10">
                {subTopicsLoading ? (
                    <div className="space-y-8">
                        <LoadingSkeleton variant="text" lines={3} />
                        <LoadingSkeleton variant="block" className="h-56" />
                        <LoadingSkeleton variant="card" />
                    </div>
                ) : subTopicsError && subTopics.length === 0 ? (
                    <ErrorState
                        title="Unable to load lessons"
                        description="No learning content could be loaded for this topic."
                    />
                ) : (
                    <>
                        {subTopicsError && (
                            <div className="mb-8 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">
                                Some lessons could not be loaded. The available lessons are still shown below.
                            </div>
                        )}

                        <div className="space-y-20">
                            {subTopics.map((subTopic, index) => (
                                <div
                                    key={subTopic.id}
                                    id={`subtopic-${subTopic.slug}`}
                                    className="relative scroll-mt-24"
                                >
                                    <ContentBody
                                        subTopic={subTopic}
                                        technologyId={technology.id}
                                    />

                                    {index < subTopics.length - 1 && (
                                        <div className="mt-20 border-b border-[#223A59]" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Topic-to-topic pagination */}
                        <div className="mt-16 border-t border-[#223A59] pt-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    disabled={!previousDestination}
                                    onClick={() => navigateToTopic(previousDestination)}
                                    className="group flex min-h-16 items-center justify-between gap-4 rounded-xl border border-[#223A59] bg-[#0E192A] px-5 py-4 text-left transition hover:border-[#00E8C2]/40 hover:bg-[#14243C] disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    <span className="flex items-center gap-3">
                                        <ArrowLeft className="h-5 w-5 shrink-0 text-[#00E8C2]" />
                                        <span>
                                            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C7394]">
                                                Previous topic
                                            </span>
                                            <span className="mt-1 block truncate text-sm font-semibold text-white">
                                                {previousDestination ? "Go to previous topic" : "First topic"}
                                            </span>
                                        </span>
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    disabled={!nextDestination}
                                    onClick={() => navigateToTopic(nextDestination)}
                                    className="group flex min-h-16 items-center justify-between gap-4 rounded-xl border border-[#223A59] bg-[#0E192A] px-5 py-4 text-right transition hover:border-[#00E8C2]/40 hover:bg-[#14243C] disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    <span className="ml-auto">
                                        <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C7394]">
                                            Next topic
                                        </span>
                                        <span className="mt-1 block truncate text-sm font-semibold text-white">
                                            {nextDestination ? "Continue learning" : "Last topic"}
                                        </span>
                                    </span>
                                    <ArrowRight className="h-5 w-5 shrink-0 text-[#00E8C2]" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </LearningLayout>
    );
}
