import { ChevronRight, Clock3, Link2 } from "lucide-react";
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
        <button type="button"
            onClick={() => navigate(`/mentor/contributions/${contribution.id}`)}
            className="
                group relative grid w-full grid-cols-1 items-stretch gap-3
                overflow-hidden rounded-lg
                border border-transparent border-l-2 border-l-[#00e8c2]
                bg-[var(--cs-bg-card)]
                pl-4 pr-3 py-3.5
                text-left transition
                hover:bg-[var(--cs-bg-surface)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/30
                md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_96px_20px] md:items-center md:gap-5
            "
        >
            {/* Primary column: id, type, title, description */}
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#60a5fa]">
                        <Clock3 size={11} />
                        Awaiting review
                    </span>

                    <ContributionTypeBadge type={contribution.contributionType} />

                    {contribution.referenceUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[var(--cs-text-muted)]">
                            <Link2 size={10} />
                            reference
                        </span>
                    )}
                </div>

                <h2 className="mt-1.5 truncate text-sm font-semibold text-[var(--cs-text-primary)] group-hover:text-white">
                    {contribution.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--cs-text-secondary)] md:hidden">
                    {contribution.description}
                </p>
            </div>

            {/* Description column (desktop only) */}
            <p className="hidden truncate text-xs leading-5 text-[var(--cs-text-secondary)] md:block">
                {contribution.description}
            </p>

            {/* Date column */}
            <div className="flex items-center justify-between border-t border-[var(--cs-border)]/60 pt-2.5 text-xs text-[var(--cs-text-muted)] md:justify-end md:border-0 md:pt-0">
                <span className="md:hidden">Submitted</span>
                <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Chevron column */}
            <ChevronRight size={16} className="hidden shrink-0 justify-self-end text-[var(--cs-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--cs-accent)] md:block"/>
        </button>
    );
}