import {
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    getPendingTopicContributions,
} from "../../../../api/topicContribution.api.ts";

import PendingContributionCard from "../components/PendingContributionCard.tsx";

export default function MentorTopicContributionsPage() {
    const navigate = useNavigate();

    const {
        data: contributions = [],
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["mentor-pending-topic-contributions"],
        queryFn: getPendingTopicContributions,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Pending Contributions
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Review learner contributions submitted for your technology.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={
                            isFetching
                                ? "animate-spin"
                                : ""
                        }
                    />
                    Refresh
                </button>
            </div>

            {isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <h2 className="font-semibold text-red-800">
                        Unable to load pending contributions
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        Please try again.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white"
                    >
                        Try Again
                    </button>
                </div>
            ) : contributions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        No pending contributions
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        New learner contributions will appear here when they are submitted.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {contributions.map(
                        (contribution) => (
                            <PendingContributionCard
                                key={contribution.id}
                                contribution={
                                    contribution
                                }
                                onView={(id) =>
                                    navigate(
                                        `/mentor/topic-contributions/${id}`
                                    )
                                }
                            />
                        )
                    )}
                </div>
            )}
        </section>
    );
}