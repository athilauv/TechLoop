import { useParams } from "react-router-dom";

import { useTechnology } from "../../hooks/useTechnology";
import { useCurriculum } from "../../hooks/useCurriculum";

import LessonProgress from "./LessonProgress";
import TopicAccordion from "./TopicAccordion";

export default function CurriculumSidebar() {
    const { technologySlug } = useParams();

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

    if (!technologySlug) {
        return (
            <aside className="flex h-full items-center justify-center text-slate-500">
                Select a technology.
            </aside>
        );
    }

    if (technologyLoading || curriculumLoading) {
        return (
            <aside className="flex h-full items-center justify-center text-slate-400">
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
            <aside className="flex h-full items-center justify-center text-red-400">
                Unable to load curriculum.
            </aside>
        );
    }

    const totalLessons = curriculum.topics.reduce(
        (sum, topic) => sum + topic.subTopics.length,
        0
    );

    return (
        <aside className="flex h-full flex-col">

            {/* Header */}

            <div className="border-b border-white/5 p-6">

                <h2 className="text-xl font-semibold text-white">
                    {technology.name}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    {curriculum.topics.length} Topics
                </p>

            </div>

            {/* Progress */}

            <LessonProgress
                completed={0}
                total={totalLessons}
            />

            {/* Topics */}

            <div className="flex-1 overflow-y-auto">

                {curriculum.topics.map((topic) => (

                    <TopicAccordion
                        key={topic.id}
                        technologySlug={technology.slug}
                        topic={topic}
                    />

                ))}

            </div>

        </aside>
    );
}