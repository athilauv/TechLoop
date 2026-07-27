import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../shared/components/common/feedback/Loader.tsx";
import CurriculumSidebar from "../components/CurriculumSidebar";
import LearningContent from "../components/LearningContent";
import type { Technology } from "../types/Technology";
import type { Topic } from "../types/Topic";
import type { SubTopic } from "../types/SubTopic";
import { getTechnologyBySlug } from "../api/technologyService.ts";
import { getAllTopics} from "../api/topicService.ts";
import { getAllSubTopics } from "../api/subTopicService.ts";

export default function TechnologyPage() {
    const navigate = useNavigate();

    const {
        technologySlug,
        topicSlug,
        subTopicSlug,
    } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [technology, setTechnology] =
        useState<Technology | null>(null);

    const [topics, setTopics] = useState<
        Topic[]
    >([]);

    const [subTopics, setSubTopics] =
        useState<SubTopic[]>([]);

    const [
        selectedTopic,
        setSelectedTopic,
    ] = useState<Topic | null>(null);

    const [
        selectedSubTopic,
        setSelectedSubTopic,
    ] = useState<SubTopic | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const tech =
                    await getTechnologyBySlug(
                        technologySlug!
                    );

                setTechnology(tech);

                const allTopics =
                    await getAllTopics();

                const technologyTopics =
                    allTopics.filter(
                        (x) =>
                            x.technologyId ===
                            tech.id
                    );

                setTopics(
                    technologyTopics
                );

               

                const allSubTopics =
                    await getAllSubTopics();

                console.log("All SubTopics", allSubTopics);

                const technologySubTopics =
                    allSubTopics.filter((x) =>
                        technologyTopics.some(
                            (t) => t.id === x.topicId
                        )
                    );

                console.log("Filtered", technologySubTopics);

                setSubTopics(
                    technologySubTopics
                );
                console.log("Technology", tech);

                console.log("Topics", technologyTopics);

                console.log("SubTopics", technologySubTopics);

                const currentTopic =
                    technologyTopics.find(
                        (x) =>
                            x.slug ===
                            topicSlug
                    ) ??
                    technologyTopics[0] ??
                    null;

                setSelectedTopic(
                    currentTopic
                );

                const currentSubTopic =
                    technologySubTopics.find(
                        (x) =>
                            x.slug ===
                            subTopicSlug
                    ) ??
                    technologySubTopics.find(
                        (x) =>
                            x.topicId ===
                            currentTopic?.id
                    ) ??
                    null;

                setSelectedSubTopic(
                    currentSubTopic
                );
            } finally {
                setLoading(false);
            }
        }

        if (technologySlug) {
            load();
        }
    }, [
        technologySlug,
        topicSlug,
        subTopicSlug,
    ]);

    const orderedSubTopics =
        useMemo(() => {
            if (!selectedTopic)
                return [];

            return subTopics
                .filter(
                    (x) =>
                        x.topicId ===
                        selectedTopic.id
                )
                .sort(
                    (a, b) =>
                        a.position -
                        b.position
                );
        }, [
            subTopics,
            selectedTopic,
        ]);

    const currentIndex =
        orderedSubTopics.findIndex(
            (x) =>
                x.id ===
                selectedSubTopic?.id
        );

    const previousLesson =
        currentIndex > 0
            ? orderedSubTopics[
            currentIndex - 1
                ]
            : null;

    const nextLesson =
        currentIndex >= 0 &&
        currentIndex <
        orderedSubTopics.length - 1
            ? orderedSubTopics[
            currentIndex + 1
                ]
            : null;
    const handleTopicSelect = (
        topic: Topic
    ) => {
        setSelectedTopic(topic);

        const firstSubTopic =
            subTopics
                .filter(
                    (x) =>
                        x.topicId ===
                        topic.id
                )
                .sort(
                    (a, b) =>
                        a.position -
                        b.position
                )[0];

        if (!firstSubTopic) return;

        setSelectedSubTopic(
            firstSubTopic
        );

        navigate(
            `/learner/learning/${technology?.slug}/${topic.slug}/${firstSubTopic.slug}`
        );
    };

    const handleSubTopicSelect = (
        subTopic: SubTopic
    ) => {
        const topic = topics.find(
            (x) =>
                x.id ===
                subTopic.topicId
        );

        if (!topic) return;

        setSelectedTopic(topic);

        setSelectedSubTopic(
            subTopic
        );

        navigate(
            `/learner/learning/${technology?.slug}/${topic.slug}/${subTopic.slug}`
        );
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#081423]">
                <Loader />
            </div>
        );
    }

    if (!technology) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                Technology not found.
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">

            <CurriculumSidebar
                technology={technology}
                topics={topics}
                subTopics={subTopics}
                selectedTopic={selectedTopic}
                selectedSubTopic={selectedSubTopic}
                onTopicSelect={handleTopicSelect}
                onSubTopicSelect={handleSubTopicSelect}
            />

            <LearningContent
                topic={selectedTopic}
                subTopic={selectedSubTopic}
                previousTitle={previousLesson?.title}
                nextTitle={nextLesson?.title}
                canGoPrevious={!!previousLesson}
                canGoNext={!!nextLesson}
                onPrevious={() => {
                    if (previousLesson) {
                        handleSubTopicSelect(previousLesson);
                    }
                }}
                onNext={() => {
                    if (nextLesson) {
                        handleSubTopicSelect(nextLesson);
                    }
                }}
            />

        </div>
    );
}