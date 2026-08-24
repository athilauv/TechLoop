import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getMyTopicContributions } from "../../../../api/topicContribution.api.ts";
import { CONTRIBUTION_STATUS } from "../../../../types/enums/contribution-status.ts";
import TopicContributionEmptyState from "../components/TopicContributionEmptyState.tsx";
import TopicContributionCard from "../components/TopicContributionCard.tsx";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "published";

const FILTERS: { key: StatusFilter; label: string; status?: number }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending", status: CONTRIBUTION_STATUS.PENDING },
    { key: "approved", label: "Approved", status: CONTRIBUTION_STATUS.APPROVED },
    { key: "published", label: "Published", status: CONTRIBUTION_STATUS.PUBLISHED },
    { key: "rejected", label: "Rejected", status: CONTRIBUTION_STATUS.REJECTED },
];

export default function TopicContributionPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<StatusFilter>("all");

    const {
        data: contributions = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["my-topic-contributions"],
        queryFn: getMyTopicContributions,
    });

    const activeFilter = FILTERS.find((entry) => entry.key === filter);

    const filteredContributions = useMemo(() => {
        if (!activeFilter?.status) {
            return contributions;
        }
        return contributions.filter(
            (contribution) => contribution.status === activeFilter.status
        );
    }, [contributions, activeFilter]);

    const counts = useMemo(() => {
        return contributions.reduce<Record<number, number>>((acc, item) => {
            acc[item.status] = (acc[item.status] ?? 0) + 1;
            return acc;
        }, {});
    }, [contributions]);

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 py-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                            learner / contributions
                        </p>
                        <h1 className="mt-1.5 text-2xl font-semibold text-[var(--cs-text-primary)]">
                            My Contributions
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Every submission you push through review, in one ledger.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/learner/topic-contributions/new")}
                        className="inline-flex items-center gap-2 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cs-bg-page)]"
                    >
                        <Plus size={16} />
                        New Contribution
                    </button>
                </div>

                {!isLoading && !isError && contributions.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                        {FILTERS.map((entry) => {
                            const count = entry.status
                                ? counts[entry.status] ?? 0
                                : contributions.length;
                            const isActive = filter === entry.key;

                            return (
                                <button
                                    key={entry.key}
                                    type="button"
                                    onClick={() => setFilter(entry.key)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                        isActive
                                            ? "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]"
                                            : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                                    }`}
                                >
                                    {entry.label}
                                    <span className="font-[var(--cs-font-mono)] text-[10px] text-[var(--cs-text-muted)]">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto p-7">
                {isLoading ? (
                    <LedgerSkeleton />
                ) : isError ? (
                    <div className="mx-auto max-w-md rounded-[var(--cs-radius-card)] border border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] p-6 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cs-bg-page)]">
                            <AlertTriangle size={20} className="text-[var(--cs-danger)]" />
                        </div>
                        <h2 className="mt-3 font-semibold text-[var(--cs-text-primary)]">
                            Unable to load contributions
                        </h2>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Something went wrong on our end. Try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-4 inline-flex items-center gap-2 rounded-[var(--cs-radius-control)] border border-[var(--cs-danger-border)] px-4 py-2 text-sm font-medium text-[var(--cs-danger)] transition hover:bg-[var(--cs-danger-subtle)]"
                        >
                            <RefreshCw size={14} />
                            Try Again
                        </button>
                    </div>
                ) : contributions.length === 0 ? (
                    <TopicContributionEmptyState
                        onCreate={() => navigate("/learner/topic-contributions/new")}
                    />
                ) : filteredContributions.length === 0 ? (
                    <div className="flex min-h-[240px] items-center justify-center text-sm text-[var(--cs-text-muted)]">
                        No contributions match this filter.
                    </div>
                ) : (
                    <ol className="mx-auto max-w-3xl">
                        {filteredContributions.map((contribution, index) => (
                            <li key={contribution.id} className="relative flex gap-4 pb-1">
                                {/* Ledger rail */}
                                <div className="flex w-6 shrink-0 flex-col items-center">
                                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[var(--cs-bg-page)] bg-[var(--cs-accent)] ring-1 ring-[var(--cs-accent-border)]" />
                                    {index < filteredContributions.length - 1 && (
                                        <span className="cs-ledger-rail w-px flex-1" />
                                    )}
                                </div>

                                {/* Entry */}
                                <div className="mb-4 flex-1">
                                    <TopicContributionCard
                                        contribution={contribution}
                                        onView={(id) =>
                                            navigate(`/learner/topic-contributions/${id}`)
                                        }
                                    />
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}

function LedgerSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex gap-4 rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)] px-5 py-4"
                >
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--cs-border)]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-[var(--cs-bg-input)]" />
                        <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--cs-bg-input)]" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--cs-bg-input)]" />
                    </div>
                </div>
            ))}
        </div>
    );
}
