import { ExternalLink, FileText, User } from "lucide-react";

import Card, { CardSection } from "../../../../shared/Card.tsx";
import ContributionStatusBadge from "../../../../shared/ContributionStatusBadge.tsx";
import ContributionTypeBadge from "../../../../shared/ContributionTypeBadge.tsx";
import type {
    TopicContributionResponse,
} from "../../../../types/topicContribution.types.ts";

interface MentorContributionDetailsProps {
    contribution: TopicContributionResponse;
}

export default function MentorContributionDetails({
                                                      contribution,
                                                  }: MentorContributionDetailsProps) {
    // The detail response has no explicit `contributionType` field (unlike
    // the pending-list response), so it's derived from topicId nullability:
    // no topicId -> proposing a new Topic under the technology;
    // topicId present -> proposing a new SubTopic under that topic.
    const derivedType = contribution.topicId === null ? "Topic" : "SubTopic";
    const isReviewed = contribution.status !== 1;

    return (
        <div className="space-y-5">
            {/* =====================================================
                Contribution Overview
            ===================================================== */}
            <Card>
                <CardSection>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className="
                                        flex h-9 w-9 items-center justify-center
                                        rounded-lg
                                        border border-[var(--cs-border)]
                                        bg-[var(--cs-bg-input)]
                                        text-[var(--cs-accent)]
                                    "
                                >
                                    <FileText size={17} />
                                </span>

                                <ContributionTypeBadge type={derivedType} />
                            </div>

                            <h1 className="mt-4 text-2xl font-semibold text-[var(--cs-text-primary)]">
                                {contribution.title}
                            </h1>
                        </div>

                        <ContributionStatusBadge status={contribution.status} />
                    </div>
                </CardSection>

                {/* Metadata */}
                <CardSection divider="top">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Technology
                            </p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.technologyName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Topic
                            </p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.topicTitle ?? "New topic (this submission)"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Sub Topic
                            </p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.subTopicTitle ?? "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Submitted By
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--cs-text-secondary)]">
                                <User size={14} className="text-[var(--cs-text-muted)]" />
                                {contribution.learnerName}
                            </div>
                        </div>
                    </div>
                </CardSection>
            </Card>

            {/* =====================================================
                Content
            ===================================================== */}
            <Card>
                <CardSection>
                    <h2 className="text-base font-semibold text-[var(--cs-text-primary)]">
                        Description
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                        {contribution.description}
                    </p>
                </CardSection>

                {contribution.example && (
                    <CardSection divider="top">
                        <h2 className="text-base font-semibold text-[var(--cs-text-primary)]">
                            Example
                        </h2>
                        <pre
                            className="
                                mt-3 overflow-x-auto rounded-lg
                                border border-[var(--cs-border)]
                                bg-[var(--cs-bg-input)]
                                p-4
                                text-sm leading-6
                                text-[var(--cs-text-primary)]
                            "
                        >
                            <code>{contribution.example}</code>
                        </pre>
                    </CardSection>
                )}

                {contribution.referenceUrl && (
                    <CardSection divider="top">
                        <h2 className="text-base font-semibold text-[var(--cs-text-primary)]">
                            Reference
                        </h2>

                     <a   href={contribution.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                        mt-3 inline-flex items-center gap-2
                        text-sm font-medium
                        text-[var(--cs-accent)]
                        transition
                        hover:text-[var(--cs-accent-hover)]
                        hover:underline
                        ">
                        Open reference
                        <ExternalLink size={14} />
                    </a>
                    </CardSection>
                    )}
            </Card>

            {isReviewed && (
            <Card>
                <CardSection>
                    <h2 className="text-base font-semibold text-[var(--cs-text-primary)]">
                        Review Outcome
                    </h2>

                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Reviewed By
                            </p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.reviewerName ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Reviewed On
                            </p>
                            <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                                {contribution.reviewedAt
                                    ? new Date(
                                        contribution.reviewedAt
                                    ).toLocaleString()
                                    : "—"}
                            </p>
                        </div>
                    </div>

                    {contribution.reviewNotes && (
                        <div className="mt-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                Review Notes
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                                {contribution.reviewNotes}
                            </p>
                        </div>
                    )}

                    {contribution.status === 2 && (
                        <p className="mt-4 text-xs leading-5 text-[var(--cs-text-muted)]">
                            This contribution was approved and moved into the
                            relevant management area as a draft. It has not
                            been published to learners yet.
                        </p>
                    )}
                </CardSection>
            </Card>
            )}
        </div>
    );
}