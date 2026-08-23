import { GitCommitVertical } from "lucide-react";
import type { TopicContributionSummaryResponse } from "../../../../types/topicContribution.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import ContributionStatusBadge from "./ContributionStatusBadge.tsx";

interface TopicContributionCardProps {
    contribution: TopicContributionSummaryResponse;
    onView: (id: number) => void;
}

export default function TopicContributionCard({
                                                  contribution,
                                                  onView,
                                              }: TopicContributionCardProps) {
    return (
        <button
            type="button"
            onClick={() => onView(contribution.id)}
            className="group w-full rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] px-5 py-4 text-left transition hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-bg-card-raised)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/30"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-[var(--cs-font-mono)] text-[11px] text-[var(--cs-text-muted)]">
                            #{String(contribution.id).padStart(4, "0")}
                        </span>
                        <span className="text-xs text-[var(--cs-text-muted)]">
                            {contribution.technologyName}
                        </span>
                    </div>

                    <h3 className="mt-1 truncate text-base font-semibold text-[var(--cs-text-primary)] group-hover:text-white">
                        {contribution.topicTitle || "Untitled Contribution"}
                    </h3>

                    {contribution.subTopicTitle && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--cs-text-secondary)]">
                            <GitCommitVertical size={12} className="text-[var(--cs-text-muted)]" />
                            {contribution.subTopicTitle}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <ContributionStatusBadge status={contribution.status} />
                    <span className="text-xs text-[var(--cs-text-muted)]">
                        {formatRelativeTime(contribution.createdAt)}
                    </span>
                </div>
            </div>
        </button>
    );
}
