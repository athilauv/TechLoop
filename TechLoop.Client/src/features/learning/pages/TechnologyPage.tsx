import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../shared/components/common/feedback/Loader.tsx";
import EmptyState from "../../../shared/components/common/feedback/EmptyState.tsx";
import CurriculumSidebar from "../components/CurriculumSidebar";
import LearningContent from "../components/LearningContent";
import type { Technology } from "../types/Technology";
import type { Topic } from "../types/Topic";
import type { SubTopic } from "../types/SubTopic";
import { getTechnologyBySlug } from "../api/technologyService.ts";
import { getAllTopics } from "../api/topicService.ts";
import { getAllSubTopics } from "../api/subTopicService.ts";

export default function TechnologyPage() {
    const navigate = useNavigate();
    const { technologySlug, topicSlug, subTopicSlug } = useParams();

    const [loading, setLoading] = useState(true);
    const [technology, setTechnology] = useState<Technology | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

    // Briefly suppresses scroll-spy → URL sync right after a programmatic
    // scroll (sidebar click / topic switch), so it doesn't fight the click.
    const suppressSpySync = useRef(false);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const tech = await getTechnologyBySlug(technologySlug!);
                setTechnology(tech);

                const allTopics = await getAllTopics();
                const technologyTopics = allTopics
                    .filter((x) => x.technologyId === tech.id)
                    .sort((a, b) => a.position - b.position);
                setTopics(technologyTopics);

                const allSubTopics = await getAllSubTopics();
                const technologySubTopics = allSubTopics
                    .filter((x) => technologyTopics.some((t) => t.id === x.topicId))
                    .sort((a, b) => a.position - b.position);
                setSubTopics(technologySubTopics);
            } finally {
                setLoading(false);
            }
        }

        if (technologySlug) {
            void load();
        }
    }, [technologySlug]);

    const currentTopic = useMemo(() => {
        if (!topicSlug) return null;
        return topics.find((t) => t.slug === topicSlug) ?? null;
    }, [topics, topicSlug]);

    const currentTopicSubTopics = useMemo(() => {
        if (!currentTopic) return [];
        return subTopics
            .filter((s) => s.topicId === currentTopic.id)
            .sort((a, b) => a.position - b.position);
    }, [subTopics, currentTopic]);

    const currentTopicIndex = currentTopic ? topics.findIndex((t) => t.id === currentTopic.id) : -1;
    const previousTopic = currentTopicIndex > 0 ? topics[currentTopicIndex - 1] : null;
    const nextTopic =
        currentTopicIndex >= 0 && currentTopicIndex < topics.length - 1
            ? topics[currentTopicIndex + 1]
            : null;

    function scrollToSubTopic(slug: string) {
        suppressSpySync.current = true;

        requestAnimationFrame(() => {
            document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        window.setTimeout(() => {
            suppressSpySync.current = false;
        }, 700);
    }

    // Deep-link: once a topic's lessons are on the page, scroll to the
    // subtopic requested in the URL — but only once per topic load. Without
    // this guard, every scroll-spy-driven URL update (see
    // handleActiveSectionChange) would re-trigger this effect and snap the
    // page back to the section top while the user is mid-scroll.
    const initialScrollHandledForTopic = useRef<number | null>(null);

    useEffect(() => {
        if (!currentTopic) return;
        if (initialScrollHandledForTopic.current === currentTopic.id) return;

        if (!subTopicSlug) {
            initialScrollHandledForTopic.current = currentTopic.id;
            return;
        }

        if (!currentTopicSubTopics.some((s) => s.slug === subTopicSlug)) return;

        initialScrollHandledForTopic.current = currentTopic.id;
        scrollToSubTopic(subTopicSlug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTopic?.id, subTopicSlug, currentTopicSubTopics.length]);

    function handleIntroSelect() {
        if (!technology) return;
        navigate(`/learner/learning/${technology.slug}`);
    }

    function handleTopicSelect(topic: Topic) {
        if (!technology) return;
        navigate(`/learner/learning/${technology.slug}/${topic.slug}`);
    }

    function handleSubTopicSelect(subTopic: SubTopic) {
        if (!technology) return;

        const owningTopic = topics.find((t) => t.id === subTopic.topicId);
        if (!owningTopic) return;

        if (owningTopic.id === currentTopic?.id) {
            // Already on this topic's page — just scroll.
            navigate(`/learner/learning/${technology.slug}/${owningTopic.slug}/${subTopic.slug}`, {
                replace: true,
            });
            scrollToSubTopic(subTopic.slug);
        } else {
            navigate(`/learner/learning/${technology.slug}/${owningTopic.slug}/${subTopic.slug}`);
        }
    }

    function handleActiveSectionChange(slug: string) {
        if (suppressSpySync.current) return;
        if (!technology || !currentTopic) return;
        if (slug === subTopicSlug) return;

        navigate(`/learner/learning/${technology.slug}/${currentTopic.slug}/${slug}`, {
            replace: true,
        });
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#081423]">
                <Loader />
            </div>
        );
    }

    if (!technology) {
        return (
            <div className="flex h-full items-center justify-center px-6">
                <EmptyState
                    title="Technology not found"
                    description="This technology doesn't exist or hasn't been published yet."
                />
            </div>
        );
    }

    const mode: "introduction" | "topic" = currentTopic ? "topic" : "introduction";

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <CurriculumSidebar
                technology={technology}
                topics={topics}
                subTopics={subTopics}
                mode={mode}
                activeTopicId={currentTopic?.id ?? null}
                activeSubTopicSlug={subTopicSlug ?? null}
                onIntroSelect={handleIntroSelect}
                onTopicSelect={handleTopicSelect}
                onSubTopicSelect={handleSubTopicSelect}
            />

            {mode === "introduction" ? (
                <LearningContent
                    mode="introduction"
                    technology={technology}
                    topicCount={topics.length}
                    onStartLearning={() => {
                        if (topics.length === 0) return;
                        handleTopicSelect(topics[0]);
                    }}
                />
            ) : (
                <LearningContent
                    mode="topic"
                    technology={technology}
                    topic={currentTopic!}
                    subTopics={currentTopicSubTopics}
                    previousTopic={previousTopic}
                    nextTopic={nextTopic}
                    onPreviousTopic={() => previousTopic && handleTopicSelect(previousTopic)}
                    onNextTopic={() => nextTopic && handleTopicSelect(nextTopic)}
                    onActiveSectionChange={handleActiveSectionChange}
                />
            )}
        </div>
    );
}
