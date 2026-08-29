import { ExternalLink, GitCommitVertical, User } from "lucide-react";
import type { ReactNode } from "react";

import ContributionStatusBadge from "../../../../shared/ContributionStatusBadge.tsx";
import ContributionTypeBadge from "../../../../shared/ContributionTypeBadge.tsx";
import type { TopicContributionResponse } from "../../../../types/topicContribution.types.ts";

interface MentorContributionDetailsProps {
    contribution: TopicContributionResponse;
}

interface MetaRowProps {
    label: string;
    value: string;
    icon?: ReactNode;
}

function MetaRow({ label, value, icon }: MetaRowProps) {
    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-xs text-[var(--cs-text-muted)]">{label}</span>
            <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-[var(--cs-text-secondary)]">
                {icon}
                {value}
            </span>
        </div>
    );
}

function SectionLabel({ children }: { children: ReactNode }) {
    return (
        <h2 className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
            {children}
        </h2>
    );
}

export default function MentorContributionDetails({
                                                      contribution,
                                                  }: MentorContributionDetailsProps) {

    const derivedType = contribution.subTopicId !== null ? "SubTopic" : "Topic";
    const isReviewed = contribution.status !== 1;

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Main column */}
            <div className="space-y-5">
                {/* Title strip */}
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-[var(--cs-font-mono)] text-xs text-[var(--cs-text-muted)]">
                            #{String(contribution.id ?? 0).padStart(4, "0")}
                        </span>
                        <ContributionTypeBadge type={derivedType} />
                        <ContributionStatusBadge status={contribution.status} />
                    </div>

                    <h1 className="mt-2 text-2xl font-semibold text-[var(--cs-text-primary)]">
                        {contribution.title}
                    </h1>
                </div>

                {/* Description / example / reference */}
                <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-6">
                    <SectionLabel>description</SectionLabel>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                        {contribution.description}
                    </p>

                    {contribution.example && (
                        <div className="mt-6 border-t border-[var(--cs-border)] pt-6">
                            <SectionLabel>example</SectionLabel>
                            <pre className="mt-2 overflow-x-auto rounded-[var(--cs-radius-control)] border border-[var(--cs-border)] bg-[var(--cs-bg-input)] p-4 font-[var(--cs-font-mono)] text-sm leading-6 text-[var(--cs-text-primary)]">
                                <code>{contribution.example}</code>
                            </pre>
                        </div>
                    )}

                    {contribution.referenceUrl && (
                        <div className="mt-6 border-t border-[var(--cs-border)] pt-6">
                            <SectionLabel>reference</SectionLabel>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
                <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-5">
                    <SectionLabel>context</SectionLabel>
                    <div className="mt-1 divide-y divide-[var(--cs-border)]/60">
                        <MetaRow label="Technology" value={contribution.technologyName} />
                        <MetaRow
                            label="Topic"
                            value={contribution.topicTitle ?? "New topic (this submission)"}
                        />
                        <MetaRow
                            label="Sub Topic"
                            value={contribution.subTopicTitle ?? "Not specified"}
                            icon={
                                contribution.subTopicTitle ? (
                                    <GitCommitVertical size={11} className="text-[var(--cs-text-muted)]" />
                                ) : undefined
                            }
                        />
                        <MetaRow
                            label="Submitted By"
                            value={contribution.learnerName}
                            icon={<User size={11} className="text-[var(--cs-text-muted)]" />}
                        />
                    </div>
                </div>

                {isReviewed ? (
                    <div className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-5">
                        <SectionLabel>review outcome</SectionLabel>

                        <div className="mt-1 divide-y divide-[var(--cs-border)]/60">
                            <MetaRow label="Reviewed By" value={contribution.reviewerName ?? "—"} />
                            <MetaRow
                                label="Reviewed On"
                                value={
                                    contribution.reviewedAt
                                        ? new Date(contribution.reviewedAt).toLocaleString()
                                        : "—"
                                }
                            />
                        </div>

                        {contribution.reviewNotes && (
                            <div className="mt-3 border-t border-[var(--cs-border)] pt-3">
                                <p className="text-xs text-[var(--cs-text-muted)]">Review Notes</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-[var(--cs-text-secondary)]">
                                    {contribution.reviewNotes}
                                </p>
                            </div>
                        )}

                        {contribution.status === 2 && (
                            <p className="mt-3 border-t border-[var(--cs-border)] pt-3 text-xs leading-5 text-[var(--cs-text-muted)]">
                                This contribution was approved and moved into the relevant
                                management area as a draft. It has not been published to
                                learners yet.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="rounded-[var(--cs-radius-card)] border border-dashed border-[var(--cs-border)] bg-[var(--cs-bg-card)]/60 p-5 text-center">
                        <p className="text-xs leading-5 text-[var(--cs-text-muted)]">
                            This contribution is awaiting mentor review. Approve or reject
                            it to record a review outcome here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
