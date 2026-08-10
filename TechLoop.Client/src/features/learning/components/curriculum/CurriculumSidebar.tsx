import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTechnology } from "../../../../hooks/useTechnology.ts";
import { useCurriculum } from "../../../../hooks/useCurriculum.ts";
import LessonProgress from "./LessonProgress";
import TopicAccordion from "./TopicAccordion";

export default function CurriculumSidebar() {
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
    } = useTechnology(technologySlug ?? "");

    const technologyId = technology?.id ?? 0;

    const {
        data: curriculum,
        isLoading: curriculumLoading,
        isError: curriculumError,
    } = useCurriculum(technologyId);

    /*
     * When a technology is opened without a topic/subtopic,
     * automatically open the first subtopic of the first topic.
     */
    useEffect(() => {
        if (
            !technologySlug ||
            !curriculum ||
            topicSlug ||
            subTopicSlug
        ) {
            return;
        }

        const firstTopic = curriculum.topics[0];

        if (!firstTopic) {
            return;
        }

        const firstSubTopic = firstTopic.subTopics[0];

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