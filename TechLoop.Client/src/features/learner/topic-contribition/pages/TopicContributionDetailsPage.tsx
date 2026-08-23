import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2, SearchX } from "lucide-react";

import { getMyTopicContributionById } from "../../../../api/topicContribution.api.ts";
import TopicContributionDetails from "../components/TopicContributionDetails.tsx";

export default function TopicContributionDetailsPage() {
    const { contributionId } = useParams<{ contributionId: string }>();
    const navigate = useNavigate();

    const parsedContributionId = Number(contributionId);
    const isValidId = Number.isInteger(parsedContributionId) && parsedContributionId > 0;

    const {
        data: contribution,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["my-topic-contribution", parsedContributionId],
        queryFn: () => getMyTopicContributionById(parsedContributionId),
        enabled: isValidId,
    });

    if (!isValidId) {
        return (
            <div className="content-studio-theme flex h-full min-h-0 items-center justify-center p-7">
                <div className="max-w-md rounded-[var(--cs-radius-card)] border border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] p-6 text-center">
                    <AlertTriangle size={22} className="mx-auto text-[var(--cs-danger)]" />
                    <h2 className="mt-3 font-semibold text-[var(--cs-text-primary)]">
                        Invalid contribution ID.
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate("/learner/topic-contributions")}
                        className="mt-4 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-4 py-2 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)]"
                    >
                        Back to Contributions
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="content-studio-theme flex h-full min-h-0 items-center justify-center p-7">
                <Loader2 size={26} className="animate-spin text-[var(--cs-accent)]" />
            </div>
        );
    }

    if (isError || !contribution) {
        return (
            <div className="content-studio-theme flex h-full min-h-0 items-center justify-center p-7">
                <div className="max-w-md rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--cs-border)] bg-[var(--cs-bg-surface)]">
                        <SearchX size={24} className="text-[var(--cs-text-muted)]" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-[var(--cs-text-primary)]">
                        Contribution not found
                    </h2>
                    <p className="mt-2 text-sm text-[var(--cs-text-secondary)]">
                        The contribution may no longer exist or you may not have access to it.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/learner/topic-contributions")}
                        className="mt-5 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-4 py-2 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)]"
                    >
                        Back to Contributions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="content-studio-theme h-full min-h-0 overflow-y-auto p-7">
            <div className="mx-auto w-full max-w-3xl">
                <TopicContributionDetails
                    contribution={contribution}
                    onBack={() => navigate("/learner/topic-contributions")}
                />
            </div>
        </div>
    );
}
