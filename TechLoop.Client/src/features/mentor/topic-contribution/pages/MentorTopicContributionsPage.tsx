import { FileCheck2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";
import EmptyState from "../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner.tsx";
import { getPendingTopicContributions } from "../../../../api/mentorTopicContribution.api.ts";
import PendingContributionCard from "../components/PendingContributionCard.tsx";
import type { TopicContributionPendingResponse } from "../../../../types/topicContribution.types.ts";

type TypeFilter = "all" | "topic" | "subtopic";


interface FilterTabProps {
    active: boolean;
    label: string;
    count: number;
    onClick: () => void;
}

function FilterTab({ active, label, count, onClick }: FilterTabProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative inline-flex items-center gap-2 whitespace-nowrap px-1 pb-3 pt-1
                text-xs font-medium transition
                ${active ? "text-[var(--cs-accent)]" : "text-[var(--cs-text-secondary)] hover:text-[var(--cs-text-primary)]"}
            `}
        >
            {label}
            <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]" : "bg-white/5 text-[var(--cs-text-muted)]"
                }`}
            >
                {count}
            </span>
            {active && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--cs-accent)]" />
            )}
        </button>
    );
}

export default function MentorTopicContributionsPage() {
    const [contributions, setContributions] =
        useState<TopicContributionPendingResponse[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

    useEffect(() => {
        const loadContributions = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getPendingTopicContributions();

                setContributions(data);
            } catch {
                setError("Unable to load pending contributions.");
            } finally {
                setLoading(false);
            }
        };

        void loadContributions();
    }, []);

    const typeCounts = useMemo(() => {
        return contributions.reduce(
            (acc, contribution) => {
                const isSub = contribution.contributionType.toLowerCase().includes("sub");
                acc[isSub ? "subtopic" : "topic"] += 1;
                return acc;
            },
            { topic: 0, subtopic: 0 }
        );
    }, [contributions]);

    const filteredContributions = useMemo(() => {
        return contributions.filter((contribution) => {
            const matchesType = typeFilter === "all" || contribution.contributionType
                    .toLowerCase()
                    .includes(typeFilter === "subtopic" ? "sub" : "topic");

            const query = search.trim().toLowerCase();
            const matchesSearch = query.length === 0 ||
                contribution.title.toLowerCase().includes(query) ||
                contribution.description.toLowerCase().includes(query);

            return matchesType && matchesSearch;
        });
    }, [contributions, search, typeFilter]);

    const filterOptions = [
        { key: "all" as const, label: "All", count: contributions.length },
        { key: "topic" as const, label: "Topics", count: typeCounts.topic },
        { key: "subtopic" as const, label: "SubTopics", count: typeCounts.subtopic },
    ];

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 pt-5">
                <Breadcrumb items={[{ label: "Mentor" }, { label: "Topic Contributions" }]} />

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--cs-text-primary)]">
                            Review Queue
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Learner-submitted topic and subtopic contributions awaiting review.
                        </p>
                    </div>

                    {!loading && !error && contributions.length > 0 && (
                        <div className="relative w-full sm:w-64">
                            <Search
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search the queue..."
                                className="
                                    w-full rounded-lg
                                    border border-[var(--cs-border)]
                                    bg-[var(--cs-bg-input)]
                                    py-2 pl-8 pr-3
                                    text-sm text-[var(--cs-text-primary)]
                                    outline-none transition
                                    placeholder:text-[var(--cs-text-muted)]
                                    focus:border-[var(--cs-accent-border)]
                                "
                            />
                        </div>
                    )}
                </div>

                {!loading && !error && contributions.length > 0 && (
                    <div className="mt-5 flex gap-5 overflow-x-auto">
                        {filterOptions.map((entry) => (
                            <FilterTab
                                key={entry.key}
                                active={typeFilter === entry.key}
                                label={entry.label}
                                count={entry.count}
                                onClick={() => setTypeFilter(entry.key)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto p-7">
                {loading ? (
                    <LoadingSpinner size="lg" label="Loading contributions..." fullHeight />
                ) : error ? (
                    <EmptyState
                        icon={<FileCheck2 size={24} />}
                        title="Unable to load contributions"
                        description={error}
                    />
                ) : contributions.length === 0 ? (
                    <EmptyState
                        icon={<FileCheck2 size={24} />}
                        title="Queue is empty"
                        description="There are no learner contributions waiting for review."
                    />
                ) : (
                    <div className="mx-auto max-w-4xl">
                        <p className="mb-3 text-xs text-[var(--cs-text-muted)]">
                            {filteredContributions.length} of {contributions.length}{" "}
                            contribution{contributions.length !== 1 ? "s" : ""} waiting for review
                        </p>

                        {filteredContributions.length === 0 ? (
                            <EmptyState
                                icon={<Search size={24} />}
                                title="No matching contributions"
                                description="Try adjusting your search or type filter."
                            />
                        ) : (
                            <div>
                                {/* Column header — desktop only, purely visual */}
                                <div className="mb-2 hidden grid-cols-[minmax(0,1fr)_minmax(0,220px)_96px_20px] gap-5 px-4 md:grid">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cs-text-muted)]">
                                        Contribution
                                    </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cs-text-muted)]">
                                        Description
                                    </span>
                                    <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-[var(--cs-text-muted)]">
                                        Submitted
                                    </span>
                                    <span />
                                </div>

                                <div className="space-y-2">
                                    {filteredContributions.map((contribution) => (
                                        <PendingContributionCard
                                            key={contribution.id}
                                            contribution={contribution}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
