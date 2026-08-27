import { ChevronRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ContributionTypeBadge from "../../../../shared/ContributionTypeBadge.tsx";
import type { TopicContributionPendingResponse } from "../../../../types/topicContribution.types.ts";

interface PendingContributionCardProps {
    contribution: TopicContributionPendingResponse;
}


export default function PendingContributionCard({
                                                    contribution,
                                                }: PendingContributionCardProps) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(`/mentor/contributions/${contribution.id}`)}
            className="
                group flex w-full items-center gap-5
                rounded-[var(--cs-radius-card)]
                border border-[var(--cs-border)]
                bg-[var(--cs-bg-card)]
                px-5 py-4
                text-left transition
                hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-bg-card-raised)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/30
            "
        >
            {/* Waiting indicator */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] text-[var(--cs-warning)]">
                <Clock3 size={15} />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-[var(--cs-font-mono)] text-[11px] text-[var(--cs-text-muted)]">
                        #{String(contribution.id).padStart(4, "0")}
                    </span>
                    <ContributionTypeBadge type={contribution.contributionType} />
                </div>

                <h2 className="mt-1.5 truncate text-sm font-semibold text-[var(--cs-text-primary)] group-hover:text-white">
                    {contribution.title}
                </h2>

                <p className="mt-1 line-clamp-1 text-xs leading-5 text-[var(--cs-text-secondary)]">
                    {contribution.description}
                </p>
            </div>

            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span className="text-xs text-[var(--cs-text-muted)]">
                    {new Date(contribution.createdAt).toLocaleDateString()}
                </span>
                {contribution.referenceUrl && (
                    <span className="text-[10px] text-[var(--cs-text-muted)]">has reference</span>
                )}
            </div>

            <ChevronRight
                size={18}
                className="shrink-0 text-[var(--cs-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--cs-accent)]"
            />
        </button>
    );
}
