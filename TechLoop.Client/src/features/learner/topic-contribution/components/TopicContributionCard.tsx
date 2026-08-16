import { ArrowRight, CalendarDays } from "lucide-react";
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
    const createdDate = formatRelativeTime(contribution.createdAt);

    return (
        <article className="group rounded-2xl border border-[#223A59] bg-[#14243C] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#00E8C2]/30 hover:shadow-[0_8px_24px_-8px_rgba(0,232,194,0.15)]">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-white">
                        {contribution.topicTitle || "Untitled Contribution"}
                    </h3>

                    <p className="mt-1 text-sm text-[#8CA3BF]">
                        {contribution.technologyName}
                    </p>
                </div>

                <ContributionStatusBadge status={contribution.status} />
            </div>

            {contribution.subTopicTitle && (
                <p className="mt-3 text-sm text-[#8CA3BF]">
                    <span className="font-medium text-[#B9C8DC]">SubTopic:</span>{" "}
                    {contribution.subTopicTitle}
                </p>
            )}

            <div className="mt-4">
                <p className="flex items-center gap-2 text-xs text-[#5C7394]">
                    <CalendarDays size={14} />
                    {createdDate}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onView(contribution.id)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#00E8C2] transition hover:text-[#00DDB9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14243C] rounded"
            >
                View contribution
                <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
            </button>
        </article>
    );
}