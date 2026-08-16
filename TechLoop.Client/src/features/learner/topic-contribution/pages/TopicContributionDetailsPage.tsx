import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2, SearchX } from "lucide-react";

import {
    getMyTopicContributionById,
} from "../../../../api/topicContribution.api.ts";

import TopicContributionDetails from "../components/TopicContributionDetails.tsx";

export default function TopicContributionDetailsPage() {
    const {
        contributionId,
    } = useParams<{
        contributionId: string;
    }>();

    const navigate = useNavigate();

    const parsedContributionId =
        Number(contributionId);

    const isValidId =
        Number.isInteger(
            parsedContributionId
        ) &&
        parsedContributionId > 0;

    const {
        data: contribution,
        isLoading,
        isError,
    } = useQuery({
        queryKey: [
            "my-topic-contribution",
            parsedContributionId,
        ],

        queryFn: () =>
            getMyTopicContributionById(
                parsedContributionId
            ),

        enabled: isValidId,
    });

    if (!isValidId) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="shrink-0 text-red-400" />
                    <h2 className="font-semibold text-red-300">
                        Invalid contribution ID.
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/learner/topic-contributions")}
                    className="mt-4 rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-medium text-[#081423] transition hover:bg-[#00DDB9]"
                >
                    Back to Contributions
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 size={28} className="animate-spin text-[#00E8C2]" />
            </div>
        );
    }

    if (isError || !contribution) {
        return (
            <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-8 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0E192A] border border-[#223A59]">
                    <SearchX size={24} className="text-[#5C7394]" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-white">
                    Contribution not found
                </h2>

                <p className="mt-2 text-sm text-[#8CA3BF]">
                    The contribution may no longer exist or you may not have access to it.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/learner/topic-contributions")}
                    className="mt-5 rounded-lg bg-[#00E8C2] px-4 py-2 text-sm font-medium text-[#081423] transition hover:bg-[#00DDB9]"
                >
                    Back to Contributions
                </button>

            </div>
        );
    }

    return (
        <section className="mx-auto w-full max-w-4xl">

            <TopicContributionDetails
                contribution={contribution}
                onBack={() => navigate("/learner/topic-contributions")}
            />

        </section>
    );
}