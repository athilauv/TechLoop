import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import LearningLayout from "../components/layout/LearningLayout";
import ContentHeader from "../components/content/ContentHeader";
import ContentBody from "../components/content/ContentBody";
import Breadcrumb from "../components/common/Breadcrumb";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import { useTechnology } from "../../../hooks/useTechnology.ts";
import {useCurriculum } from "../../../hooks/useCurriculum.ts";
import { getSubTopicBySlug } from "../../../api/subTopic.api.ts";

export default function LearningPage() {
    const {
        technologySlug,
        topicSlug,
        subTopicSlug,
    } = useParams();

    const navigate =
        useNavigate();

    const {
        data: technology,
        isLoading:
            technologyLoading,
        isError:
            technologyError,
    } = useTechnology(
        technologySlug ?? ""
    );

    const technologyId =
        technology?.id ?? 0;

    const {
        data: curriculum,
        isLoading:
            curriculumLoading,
        isError:
            curriculumError,
    } = useCurriculum(
        technologyId
    );

    const currentTopic =
        useMemo(() => {
            if (
                !curriculum ||
                !topicSlug
            ) {
                return null;
            }

            return (
                curriculum.topics.find(
                    (topic) =>
                        topic.slug ===
                        topicSlug
                ) ?? null
            );
        }, [
            curriculum,
            topicSlug,
        ]);

    useEffect(() => {
        if (
            !technologySlug ||
            !curriculum ||
            topicSlug
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
        curriculum,
        topicSlug,
        navigate,
    ]);

    const subTopicQueries =
        useQueries({
            queries:
                currentTopic?.subTopics?.map(
                    (subTopic) => ({
                        queryKey: [
                            "subTopic",
                            subTopic.slug,
                        ],

                        queryFn: () =>
                            getSubTopicBySlug(
                                subTopic.slug
                            ),

                        enabled:
                            Boolean(
                                currentTopic
                            ),

                        retry: 1,
                    })
                ) ?? [],
        });

    const subTopics =
        useMemo(() => {
            return subTopicQueries
                .map(
                    (query) =>
                        query.data
                )
                .filter(
                    (
                        subTopic
                    ): subTopic is NonNullable<
                        typeof subTopic
                    > =>
                        Boolean(
                            subTopic
                        )
                );
        }, [
            subTopicQueries,
        ]);

    const subTopicsLoading =
        subTopicQueries.some(
            (query) =>
                query.isLoading
        );

    const failedQueries =
        subTopicQueries.filter(
            (query) =>
                query.isError
        );

    const subTopicsError =
        failedQueries.length > 0;


    useEffect(() => {
        if (
            failedQueries.length === 0
        ) {
            return;
        }

        console.error(
            "Failed subtopic queries:",
            failedQueries
        );

        console.error(
            "Current topic:",
            currentTopic
        );
    }, [
        failedQueries.length,
        currentTopic,
    ]);


    useEffect(() => {
        if (
            !subTopicSlug ||
            subTopics.length === 0
        ) {
            return;
        }

        const selectedSubTopic =
            subTopics.find(
                (item) =>
                    item.slug ===
                    subTopicSlug
            );

        if (!selectedSubTopic) {
            return;
        }

        const timeout =
            window.setTimeout(
                () => {
                    const element =
                        document.getElementById(
                            `subtopic-${selectedSubTopic.slug}`
                        );

                    if (!element) {
                        return;
                    }

                    element.scrollIntoView(
                        {
                            behavior:
                                "smooth",
                            block: "start",
                        }
                    );
                },
                150
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        subTopicSlug,
        subTopics,
    ]);


    if (
        !technologySlug ||
        !topicSlug
    ) {
        return (
            <LearningLayout>
                <EmptyState
                    icon={
                        <BookOpen className="h-7 w-7" />
                    }
                    title="No lesson selected"
                    description="Pick a topic from the sidebar to start learning."
                />
            </LearningLayout>
        );
    }

    if (
        technologyLoading ||
        curriculumLoading
    ) {
        return (
            <LearningLayout>
                <div className="space-y-6">
                    <LoadingSkeleton
                        variant="text"
                        lines={2}
                    />

                    <LoadingSkeleton
                        variant="card"
                    />
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
        <LearningLayout>
            <Breadcrumb
                items={[
                    {
                        label: "Learning",
                        href: "/learner/learning",
                    },
                    {
                        label: technology.name,
                        href: `/learner/learning/${technology.slug}`,
                    },
                    {
                        label: currentTopic.title,
                    },
                ]}/>

            <div className="mt-4">
                <ContentHeader title={currentTopic.title}/>
            </div>

            <div className="mt-10">
                {/* Loading */}
                {subTopicsLoading ? (
                    <div className="space-y-8">
                        <LoadingSkeleton variant="text" lines={3}/>
                        <LoadingSkeleton variant="block" className="h-56"/>
                        <LoadingSkeleton variant="card"/>
                    </div>
                ) : (
                    <>
                        {subTopicsError && (
                            <div
                                className="
                                    mb-8
                                    rounded-lg
                                    border
                                    border-yellow-500/20
                                    bg-yellow-500/5
                                    px-4
                                    py-3
                                    text-sm
                                    text-yellow-400
                                ">
                                Some lessons could
                                not be loaded.
                            </div>
                        )}

                        {subTopics.length ===
                        0 ? (
                            <ErrorState
                                title="Unable to load lessons"
                                description="No learning content could be loaded for this topic."
                            />
                        ) : (
                            <div className="space-y-20">
                                {subTopics.map(
                                    (
                                        subTopic,
                                        index
                                    ) => {
                                        if (
                                            !subTopic
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={subTopic.id}
                                                id={`subtopic-${subTopic.slug}`}
                                                className="
                                                    relative
                                                    scroll-mt-24
                                                ">
                                                <ContentBody
                                                    subTopic={
                                                        subTopic
                                                    }
                                                    technologyId={
                                                        technology.id
                                                    }
                                                />

                                                {index <
                                                    subTopics.length -
                                                    1 && (
                                                        <div className="mt-20 border-b border-[#223A59]" />
                                                    )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </LearningLayout>
    );
}