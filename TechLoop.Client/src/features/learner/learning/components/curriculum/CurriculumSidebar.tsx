import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTechnology } from "../../../../../hooks/useTechnology.ts";
import { useCurriculum } from "../../../../../hooks/useCurriculum.ts";
import LessonProgress from "./LessonProgress";
import TopicAccordion from "./TopicAccordion";

export interface CurriculumSubTopicNode {
    id: number;
    title: string;
    slug: string;
    position?: number;
    subTopics?: CurriculumSubTopicNode[];
}

function countSubTopics(
    subTopics: CurriculumSubTopicNode[]
): number {
    return subTopics.reduce(
        (total, subTopic) => {
            return (
                total +
                1 +
                countSubTopics(
                    subTopic.subTopics ?? []
                )
            );
        },
        0
    );
}

interface CurriculumSidebarProps {
    onNavigate?: () => void;
}

export default function CurriculumSidebar({ onNavigate }: CurriculumSidebarProps) {
    const navigate = useNavigate();

    const {
        technologySlug,
        topicSlug,
        subTopicSlug,
    } = useParams();

    const {
        data: technology,
        isLoading: technologyLoading,
        isError: technologyError,
    } = useTechnology(
        technologySlug ?? ""
    );

    const technologyId =
        technology?.id ?? 0;

    const {
        data: curriculum,
        isLoading: curriculumLoading,
        isError: curriculumError,
    } = useCurriculum(technologyId);

    useEffect(() => {
        if (
            !technologySlug ||
            !curriculum ||
            topicSlug ||
            subTopicSlug
        ) {
            return;
        }

        const firstTopic =
            curriculum.topics?.[0];

        if (!firstTopic) {
            return;
        }

        const firstSubTopic =
            firstTopic.subTopics?.[0];

        if (!firstSubTopic) {
            return;
        }

        navigate(
            `/learner/learning/${technologySlug}/${firstTopic.slug}/${firstSubTopic.slug}`,
            {
                replace: true,
            }
        );
    }, [
        technologySlug,
        topicSlug,
        subTopicSlug,
        curriculum,
        navigate,
    ]);
    const totalLessons = useMemo(() => {
        if (!curriculum?.topics) {
            return 0;
        }

        return curriculum.topics.reduce(
            (total, topic) => {
                return (
                    total +
                    countSubTopics(
                        (topic.subTopics ??
                            []) as CurriculumSubTopicNode[]
                    )
                );
            },
            0
        );
    }, [curriculum]);


    if (!technologySlug) {
        return (
            <aside className="flex h-full min-h-0 items-center justify-center text-slate-500">
                Select a technology.
            </aside>
        );
    }

    if (
        technologyLoading ||
        curriculumLoading
    ) {
        return (
            <aside className="flex h-full min-h-0 items-center justify-center text-slate-400">
                Loading curriculum...
            </aside>
        );
    }


    if (
        technologyError ||
        curriculumError ||
        !technology ||
        !curriculum
    ) {
        return (
            <aside className="flex h-full min-h-0 items-center justify-center text-red-400">
                Unable to load curriculum.
            </aside>
        );
    }

    return (
        <aside
            className="
                flex
                h-full
                min-h-0
                flex-col
                overflow-hidden
            ">

            <div
                className="
                    shrink-0
                    border-b
                    border-white/5
                    p-6
                ">
                <h2 className="text-xl font-semibold text-white">
                    {technology.name}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    {curriculum.topics.length} Topics
                </p>
            </div>

            <div className="shrink-0">
                <LessonProgress
                    completed={0}
                    total={totalLessons}
                />
            </div>

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    scrollbar-thin
                    scrollbar-thumb-slate-700
                    scrollbar-track-transparent
                "
            >
                {curriculum.topics.map(
                    (topic) => (
                        <TopicAccordion
                            key={topic.id}
                            technologySlug={
                                technology.slug
                            }
                            topic={topic}
                            onNavigate={onNavigate}
                        />
                    )
                )}
            </div>
        </aside>
    );
}