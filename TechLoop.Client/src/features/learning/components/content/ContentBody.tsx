import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useSubTopic } from "../../../../hooks/useSubTopic.ts";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingSkeleton from "../common/LoadingSkeleton";
import ImageViewer from "./ImageViewer";
import ExampleViewer from "./ExampleViewer";

export default function ContentBody() {
    const { subTopicSlug } = useParams();

    const {
        data: subTopic,
        isLoading,
        isError,
        refetch,
    } = useSubTopic(subTopicSlug ?? "");

    if (!subTopicSlug) {
        return (
            <EmptyState icon={BookOpen} title="No lesson selected" description="Pick a topic from the sidebar to start learning."/>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton variant="text" lines={4} />
                <LoadingSkeleton variant="block" className="h-56" />
                <LoadingSkeleton variant="card" />
            </div>
        );
    }

    if (isError || !subTopic) {
        return (
            <ErrorState title="Unable to load lesson" description="Something went wrong while fetching this lesson. Try refreshing the page." onRetry={refetch}/>
        );
    }

    return (
        <section className="space-y-10">
            <div className="whitespace-pre-wrap text-base leading-8 text-[#8CA3BF]">
                {subTopic.description}
            </div>

            {subTopic.imageUrl && (
                <ImageViewer src={subTopic.imageUrl} alt={subTopic.title} />
            )}

            {subTopic.example && (
                <ExampleViewer title="Example" code={subTopic.example} language={subTopic.exampleType?.toString()}/>
            )}
        </section>
    );
}