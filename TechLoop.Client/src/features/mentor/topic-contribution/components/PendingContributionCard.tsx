import { ChevronRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../../../shared/Card.tsx";
import Button from "../../../../shared/Button.tsx";
import ContributionTypeBadge from "../../../../shared/ContributionTypeBadge.tsx";
import type {
    TopicContributionPendingResponse,
} from "../../../../types/topicContribution.types.ts";

interface PendingContributionCardProps {
    contribution: TopicContributionPendingResponse;
}

export default function PendingContributionCard({
                                                    contribution,
                                                }: PendingContributionCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="
                transition duration-150
                hover:border-[var(--cs-accent-border)]
                hover:shadow-[0_8px_24px_-8px_rgba(0,232,194,0.15)]
            "
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0 flex-1">
                        <div className="mb-3">
                            <ContributionTypeBadge
                                type={contribution.contributionType}
                            />
                        </div>

                        <h2 className="truncate text-base font-semibold text-[var(--cs-text-primary)]">
                            {contribution.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--cs-text-secondary)]">
                            {contribution.description}
                        </p>
                    </div>

                    {/* Pending Badge */}
                    <span
                        className="
                            inline-flex shrink-0 items-center gap-1.5
                            rounded-full
                            border border-[var(--cs-warning-border)]
                            bg-[var(--cs-warning-subtle)]
                            px-3 py-1.5
                            text-xs font-medium
                            text-[var(--cs-warning)]
                        "
                    >
                        <Clock3 size={13} />
                        Pending
                    </span>
                </div>

                {/* Metadata */}
                <div
                    className="
                        mt-5 flex flex-wrap items-center gap-x-5 gap-y-2
                        border-t border-[var(--cs-border)]
                        pt-4
                        text-xs text-[var(--cs-text-muted)]
                    "
                >
                    <span>Contribution #{contribution.id}</span>

                    <span>
                        {new Date(contribution.createdAt).toLocaleDateString()}
                    </span>

                    {contribution.referenceUrl && (
                        <span className="truncate">Reference attached</span>
                    )}
                </div>

                {/* Action */}
                <div className="mt-5 flex justify-end">
                    <Button
                        variant="accent-outline"
                        size="sm"
                        icon={<ChevronRight size={14} />}
                        onClick={() =>
                            navigate(
                                `/mentor/topic-contributions/${contribution.id}`
                            )
                        }
                    >
                        Review
                    </Button>
                </div>
            </div>
        </Card>
    );
}