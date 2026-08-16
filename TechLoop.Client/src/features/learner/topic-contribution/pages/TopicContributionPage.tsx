import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {getMyTopicContributions,} from "../../../../api/topicContribution.api.ts";
import TopicContributionCard from "../components/TopicContributionCard.tsx";
import TopicContributionEmptyState from "../components/TopicContributionEmptyState.tsx";

export default function TopicContributionPage() {
    const navigate = useNavigate();

    const {
        data: contributions = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["my-topic-contributions"],
        queryFn: getMyTopicContributions,
    });

    if (isLoading) {
        return (
            <section className="space-y-6">
                {/* Header skeleton */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <div className="h-7 w-48 animate-pulse rounded-md bg-[#14243C]" />
                        <div className="h-4 w-64 animate-pulse rounded-md bg-[#14243C]" />
                    </div>
                    <div className="h-9 w-40 animate-pulse rounded-lg bg-[#14243C]" />
                </div>

                {/* Card skeletons */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index}
                            className="rounded-2xl border border-[#223A59] bg-[#14243C] p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="w-full space-y-2">
                                    <div className="h-5 w-3/4 animate-pulse rounded-md bg-[#101C30]" />
                                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#101C30]" />
                                </div>
                                <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-[#101C30]" />
                            </div>
                            <div className="mt-4 h-4 w-24 animate-pulse rounded-md bg-[#101C30]" />
                            <div className="mt-5 h-4 w-28 animate-pulse rounded-md bg-[#101C30]" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        My Contributions
                    </h1>

                    <p className="mt-1 text-sm text-[#8CA3BF]">
                        Track the contributions you have submitted.
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    {/* Add Contribution */}
                    <button type="button"
                        onClick={() => navigate("/learner/topic-contributions/create")}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-medium text-[#081423] transition hover:bg-[#00DDB9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081423]">
                        <Plus size={17} />
                        Add Contribution
                    </button>
                </div>
            </div>

            {/* Error */}
            {isError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle size={22} className="text-red-400" />
                    </div>

                    <h2 className="mt-3 font-semibold text-red-300">
                        Unable to load contributions
                    </h2>

                    <p className="mt-1 text-sm text-red-400/80">
                        Please try again.
                    </p>

                    <button type="button" onClick={() => refetch()}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25">
                        <RefreshCw size={15} />
                        Try Again
                    </button>
                </div>

            ) : contributions.length === 0 ? (

                /* Empty State */
                <TopicContributionEmptyState
                    onCreate={() => navigate("/learner/topic-contributions/create")}/>

            ) : (

                /* Contributions */
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {contributions.map((contribution) => (
                            <TopicContributionCard
                                key={contribution.id}
                                contribution={contribution}
                                onView={(id) => navigate(`/learner/topic-contributions/${id}`)}/>
                        ))}

                </div>
            )}
        </section>
    );
}