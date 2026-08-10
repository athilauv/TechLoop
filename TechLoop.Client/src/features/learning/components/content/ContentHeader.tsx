import { useParams } from "react-router-dom";

import { useSubTopic } from "../../../../hooks/useSubTopic.ts";
import ErrorState from "../common/ErrorState";

export default function ContentHeader() {
    const { subTopicSlug } = useParams();

    const {
        data: subTopic,
        isLoading,
        isError,
        refetch,
    } = useSubTopic(subTopicSlug ?? "");

    if (!subTopicSlug) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4 border-b border-[#223A59] pb-8">
                <div className="h-4 w-40 rounded bg-[#12233B]" />
                <div className="h-10 w-80 rounded bg-[#12233B]" />
                <div className="h-5 w-52 rounded bg-[#12233B]" />
            </div>
        );
    }

    if (isError || !subTopic) {
        return (
            <ErrorState
                title="Unable to load lesson"
                description="Something went wrong while fetching this lesson."
                onRetry={refetch}
            />
        );
    }

    return (
        <header className="border-b border-[#223A59] pb-8">
            <p className="text-sm font-medium text-[#00E8C2]">Learning</p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
                {subTopic.title}
            </h1>

            {subTopic.description && (
                <p className="mt-5 max-w-3xl text-base leading-8 text-[#8CA3BF]">
                    {subTopic.description}
                </p>
            )}
        </header>
    );
}