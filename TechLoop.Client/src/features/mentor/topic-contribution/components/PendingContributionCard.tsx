import {ArrowRight, CalendarDays, FileText} from "lucide-react";
import type {TopicContributionPendingResponse,} from "../../../../types/topicContribution.types.ts";
import { formatRelativeTime} from "../../../../utils/formatRelativeTime.ts";
import ContributionStatusBadge from "../../../learner/topic-contribution/components/ContributionStatusBadge.tsx";

interface PendingContributionCardProps {
    contribution: TopicContributionPendingResponse;
    onView: (id: number) => void;
}

export default function PendingContributionCard({
                                                    contribution,
                                                    onView,
                                                }: PendingContributionCardProps) {
    const createdDate = formatRelativeTime(contribution.createdAt);
    const contributionType = contribution.contributionType || "Contribution";

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                        <FileText size={16} className="text-slate-500"/>

                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {contributionType}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                        {contribution.title}
                    </h3>
                </div>

                <ContributionStatusBadge status={contribution.status}/>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {contribution.description}
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-500">
                {contribution.topicId && (
                    <p>
                        Topic ID:{" "}
                        <span className="font-medium text-slate-700">
                            {contribution.topicId}
                        </span>
                    </p>
                )}

                {contribution.subTopicId && (
                    <p>
                        SubTopic ID:{" "}
                        <span className="font-medium text-slate-700">
                            {contribution.subTopicId}
                        </span>
                    </p>
                )}

                <p className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    Submitted {createdDate}
                </p>
            </div>

            <button type="button"
                onClick={() => onView(contribution.id)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-800 transition hover:text-slate-500">
                Review contribution
                <ArrowRight size={16} />
            </button>
        </article>
    );
}