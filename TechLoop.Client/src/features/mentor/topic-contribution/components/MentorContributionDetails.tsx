import { ExternalLink, GitCommitVertical, User } from "lucide-react";

import ContributionStatusBadge from "../../../../shared/ContributionStatusBadge.tsx";
import ContributionTypeBadge from "../../../../shared/ContributionTypeBadge.tsx";
import type { TopicContributionResponse } from "../../../../types/topicContribution.types.ts";

interface MentorContributionDetailsProps {
    contribution: TopicContributionResponse;
}

export default function MentorContributionDetails({
                                                      contribution,
                                                  }: MentorContributionDetailsProps) {

    const derivedType = contribution.subTopicId !== null ? "SubTopic" : "Topic";
    const isReviewed = contribution.status !== 1;

    return (
        <div className="space-y-5">
            {/* Overview */}
            <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-[var(--cs-font-mono)] text-xs text-[var(--cs-text-muted)]">
                                #{String(contribution.id ?? 0).padStart(4, "0")}
                            </span>
                            <ContributionTypeBadge type={derivedType} />
                        </div>

                        <h1 className="mt-3 text-2xl font-semibold text-[var(--cs-text-primary)]">
                            {contribution.title}
                        </h1>
                    </div>

                    <ContributionStatusBadge status={contribution.status} />
                </div>

                <div className="mt-6 grid gap-5 border-t border-[var(--cs-border)] pt-5 sm:grid-cols-2">
                    <div>
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            technology
                        </p>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            {contribution.technologyName}
                        </p>
                    </div>

                    <div>
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            topic
                        </p>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            {contribution.topicTitle ?? "New topic (this submission)"}
                        </p>
                    </div>

                    <div>
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            sub topic
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--cs-text-secondary)]">
                            {contribution.subTopicTitle && (
                                <GitCommitVertical size={13} className="text-[var(--cs-text-muted)]" />
                            )}
                            {contribution.subTopicTitle ?? "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            submitted by
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--cs-text-secondary)]">
                            <User size={13} className="text-[var(--cs-text-muted)]" />
                            {contribution.learnerName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                    description
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                    {contribution.description}
                </p>

                {contribution.example && (
                    <div className="mt-6 border-t border-[var(--cs-border)] pt-6">
                        <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            example
                        </h2>
                        <pre className="mt-2 overflow-x-auto rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4 font-[var(--cs-font-mono)] text-sm leading-6 text-[var(--cs-text-primary)]">
                            <code>{contribution.example}</code>
                        </pre>
                    </div>
                )}

                {contribution.referenceUrl && (
                    <div className="mt-6 border-t border-[var(--cs-border)] pt-6">
                        <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            reference
                        </h2>
                        <a
                            href={contribution.referenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--cs-accent)] transition hover:text-[var(--cs-accent-hover)] hover:underline"
                        >
                            Open reference
                            <ExternalLink size={14} />
                        </a>
                    </div>
                )}
            </div>

            {/* Review outcome */}
            {isReviewed && (
                <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                    <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                        review outcome
                    </h2>

                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">Reviewed By</p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.reviewerName ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">Reviewed On</p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.reviewedAt
                                    ? new Date(contribution.reviewedAt).toLocaleString()
                                    : "—"}
                            </p>
                        </div>
                    </div>

                    {contribution.reviewNotes && (
                        <div className="mt-4">
                            <p className="text-xs text-[var(--cs-text-muted)]">Review Notes</p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                                {contribution.reviewNotes}
                            </p>
                        </div>
                    )}

                    {contribution.status === 2 && (
                        <p className="mt-4 text-xs leading-5 text-[var(--cs-text-muted)]">
                            This contribution was approved and moved into the relevant management
                            area as a draft. It has not been published to learners yet.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
