import { ArrowLeft, ExternalLink } from "lucide-react";
import type { TopicContributionResponse } from "../../../../types/topicContribution.types.ts";
import { formatRelativeTime } from "../../../../utils/formatRelativeTime.ts";
import ContributionStatusBadge from "./ContributionStatusBadge.tsx";

interface TopicContributionDetailsProps {
    contribution: TopicContributionResponse;
    onBack: () => void;
}

export default function TopicContributionDetails({
                                                     contribution,
                                                     onBack,
                                                 }: TopicContributionDetailsProps) {
    const createdDate = formatRelativeTime(contribution.createdAt);
    const reviewedDate = contribution.reviewedAt ? formatRelativeTime(contribution.reviewedAt) : null;
    const updatedDate = contribution.updatedAt ? formatRelativeTime(contribution.updatedAt) : null;

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8CA3BF] transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 rounded"
            >
                <ArrowLeft size={16} />
                Back to contributions
            </button>

            <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-[#223A59] pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-sm text-[#8CA3BF]">
                            {contribution.technologyName}
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold text-white">
                            {contribution.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#8CA3BF]">
                            {contribution.topicTitle && (
                                <span>Topic: {contribution.topicTitle}</span>
                            )}

                            {contribution.subTopicTitle && (
                                <span>SubTopic: {contribution.subTopicTitle}</span>
                            )}
                        </div>
                    </div>

                    <ContributionStatusBadge status={contribution.status} />
                </div>

                <div className="mt-6 space-y-6">
                    {/* Description */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#5C7394]">
                            Description
                        </h2>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#B9C8DC]">
                            {contribution.description}
                        </p>
                    </section>

                    {/* Example */}
                    {contribution.example && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#5C7394]">
                                Example
                            </h2>

                            <pre className="mt-2 overflow-x-auto rounded-xl border border-[#223A59] bg-[#0E192A] p-4 text-sm leading-6 text-[#D7E1EE]">
                                <code>{contribution.example}</code>
                            </pre>
                        </section>
                    )}

                    {/* Reference */}
                    {contribution.referenceUrl && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#5C7394]">
                                Reference
                            </h2>

                            <a
                            href={contribution.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#00E8C2] hover:text-[#00DDB9] hover:underline"
                            >
                            Open reference
                            <ExternalLink size={15} />
                        </a>
                        </section>
                        )}

                    {/* Metadata */}
                    <section className="grid gap-4 border-t border-[#223A59] pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[#5C7394]">
                                Submitted
                            </p>
                            <p className="mt-1 text-sm text-[#B9C8DC]">{createdDate}</p>
                        </div>

                        {contribution.reviewerName && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[#5C7394]">
                                    Reviewed By
                                </p>
                                <p className="mt-1 text-sm text-[#B9C8DC]">
                                    {contribution.reviewerName}
                                </p>
                            </div>
                        )}

                        {reviewedDate && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[#5C7394]">
                                    Reviewed At
                                </p>
                                <p className="mt-1 text-sm text-[#B9C8DC]">{reviewedDate}</p>
                            </div>
                        )}

                        {updatedDate && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[#5C7394]">
                                    Updated
                                </p>
                                <p className="mt-1 text-sm text-[#B9C8DC]">{updatedDate}</p>
                            </div>
                        )}
                    </section>

                    {/* Review notes */}
                    {contribution.reviewNotes && (
                        <section className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                            <h2 className="text-sm font-semibold text-amber-400">
                                Review Notes
                            </h2>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-200/90">
                                {contribution.reviewNotes}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}