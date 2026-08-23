import { ArrowLeft, ExternalLink, GitCommitVertical, User } from "lucide-react";
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
        <div className="space-y-5">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--cs-text-secondary)] transition hover:text-[var(--cs-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/40 rounded"
            >
                <ArrowLeft size={16} />
                Back to ledger
            </button>

            {/* Commit header */}
            <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-[var(--cs-font-mono)] text-xs text-[var(--cs-text-muted)]">
                                #{String(contribution.id).padStart(4, "0")}
                            </span>
                            <span className="text-xs text-[var(--cs-text-muted)]">
                                {contribution.technologyName}
                            </span>
                        </div>

                        <h1 className="mt-2 text-2xl font-semibold text-[var(--cs-text-primary)]">
                            {contribution.title}
                        </h1>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--cs-text-secondary)]">
                            {contribution.topicTitle && <span>Topic: {contribution.topicTitle}</span>}
                            {contribution.subTopicTitle && (
                                <span className="flex items-center gap-1.5">
                                    <GitCommitVertical size={13} className="text-[var(--cs-text-muted)]" />
                                    SubTopic: {contribution.subTopicTitle}
                                </span>
                            )}
                        </div>
                    </div>

                    <ContributionStatusBadge status={contribution.status} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-[var(--cs-border)] pt-4 text-xs text-[var(--cs-text-muted)]">
                    <span>pushed {createdDate}</span>
                    {updatedDate && <span>updated {updatedDate}</span>}
                </div>
            </div>

            {/* Content */}
            <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                <section>
                    <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                        description
                    </h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                        {contribution.description}
                    </p>
                </section>

                {contribution.example && (
                    <section className="mt-6 border-t border-[var(--cs-border)] pt-6">
                        <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            example
                        </h2>
                        <pre className="mt-2 overflow-x-auto rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4 font-[var(--cs-font-mono)] text-sm leading-6 text-[var(--cs-text-primary)]">
                            <code>{contribution.example}</code>
                        </pre>
                    </section>
                )}

                {contribution.referenceUrl && (
                    <section className="mt-6 border-t border-[var(--cs-border)] pt-6">
                        <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            reference
                        </h2>
                        <a
                            href={contribution.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--cs-accent)] hover:text-[var(--cs-accent-hover)] hover:underline"
                        >
                            Open reference
                            <ExternalLink size={15} />
                        </a>
                    </section>
                )}
            </div>

            {/* Metadata */}
            <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                    metadata
                </h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-[var(--cs-text-muted)]">Submitted</p>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">{createdDate}</p>
                    </div>

                    {contribution.reviewerName && (
                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">Reviewed By</p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--cs-text-secondary)]">
                                <User size={13} className="text-[var(--cs-text-muted)]" />
                                {contribution.reviewerName}
                            </p>
                        </div>
                    )}

                    {reviewedDate && (
                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">Reviewed At</p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">{reviewedDate}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review notes */}
            {contribution.reviewNotes && (
                <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] p-6">
                    <h2 className="text-sm font-semibold text-[var(--cs-warning)]">Review Notes</h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                        {contribution.reviewNotes}
                    </p>
                </div>
            )}
        </div>
    );
}
