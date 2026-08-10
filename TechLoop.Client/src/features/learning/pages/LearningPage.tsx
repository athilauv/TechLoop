import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

import LearningLayout from "../components/layout/LearningLayout";
import ContentHeader from "../components/content/ContentHeader";
import ContentBody from "../components/content/ContentBody";
import Breadcrumb from "../components/common/Breadcrumb";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingSkeleton from "../components/common/LoadingSkeleton";

import { useSubTopic } from "../../../hooks/useSubTopic.ts";

export default function LearningPage() {
    const { subTopicSlug } = useParams();

    const {
        isLoading,
        isError,
        data: subTopic,
        refetch,
    } = useSubTopic(subTopicSlug ?? "");

    if (!subTopicSlug) {
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

    if (isLoading) {
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

    if (isError || !subTopic) {
        return (
            <LearningLayout>
                <ErrorState
                    title="Unable to load lesson"
                    description="Something went wrong while fetching this lesson. Try refreshing the page."
                    onRetry={refetch}
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
                        href: "/learning",
                    },
                    {
                        label: subTopic.title,
                    },
                ]}
            />

            <div className="mt-4">
                <ContentHeader />
            </div>

            <div className="mt-8">
                <ContentBody />
            </div>
        </LearningLayout>
    );
}