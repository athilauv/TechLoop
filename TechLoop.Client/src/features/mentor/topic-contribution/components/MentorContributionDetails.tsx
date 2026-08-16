import {ArrowLeft, ExternalLink} from "lucide-react";
import type {TopicContributionResponse} from "../../../../types/topicContribution.types.ts";
import { formatRelativeTime} from "../../../../utils/formatRelativeTime.ts";
import ContributionStatusBadge from "../../../learner/topic-contribution/components/ContributionStatusBadge.tsx";

interface MentorContributionDetailsProps {
    contribution: TopicContributionResponse;
    onBack: () => void;
    onReview: () => void;
}

export default function MentorContributionDetails({
                                                      contribution,
                                                      onBack,
                                                      onReview,
                                                  }: MentorContributionDetailsProps) {
    const createdDate = formatRelativeTime(contribution.createdAt);
    const reviewedDate = contribution.reviewedAt ? formatRelativeTime(contribution.reviewedAt) : null;
    const updatedDate = contribution.updatedAt ? formatRelativeTime(contribution.updatedAt) : null;

    return (
        <div className="space-y-6">
            <button type="button" onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                <ArrowLeft size={16} />
                Back to pending contributions
            </button>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500">
                            {contribution.technologyName}
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                            {contribution.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                            {contribution.topicTitle && (
                                <span>
                                    Topic:{" "}
                                    {contribution.topicTitle}
                                </span>
                            )}

                            {contribution.subTopicTitle && (
                                <span>
                                    SubTopic:{" "}
                                    {contribution.subTopicTitle}
                                </span>
                            )}
                        </div>
                    </div>

                    <ContributionStatusBadge status={contribution.status}/>
                </div>

                <div className="mt-6 space-y-6">
                    {/* Contributor */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Contributor
                        </h2>

                        <p className="mt-2 text-sm text-slate-700">
                            {contribution.learnerName}
                        </p>
                    </section>

                    {/* Description */}
                    <section>
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Description
                        </h2>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {contribution.description}
                        </p>
                    </section>

                    {/* Example */}
                    {contribution.example && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Example
                            </h2>

                            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                                <code>
                                    {contribution.example}
                                </code>
                            </pre>
                        </section>
                    )}

                    {/* Reference */}
                    {contribution.referenceUrl && (
                        <section>
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Reference
                            </h2>

                            <a href={contribution.referenceUrl} target="_blank" rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                                Open reference
                                <ExternalLink size={15}/>
                            </a>
                        </section>
                    )}

                    {/* Metadata */}
                    <section className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Submitted
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {createdDate}
                            </p>
                        </div>

                        {contribution.reviewerName && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Reviewed By
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {contribution.reviewerName}
                                </p>
                            </div>
                        )}

                        {reviewedDate && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Reviewed At
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {reviewedDate}
                                </p>
                            </div>
                        )}

                        {updatedDate && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Updated
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {updatedDate}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Review */}
                    {contribution.status === 1 && (
                        <div className="flex justify-end border-t border-slate-100 pt-5">
                            <button type="button" onClick={onReview}
                                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
                                Review Contribution
                            </button>
                        </div>
                    )}

                    {/* Existing review notes */}
                    {contribution.reviewNotes && (
                        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h2 className="text-sm font-semibold text-amber-800">
                                Review Notes
                            </h2>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-900">
                                {contribution.reviewNotes}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}