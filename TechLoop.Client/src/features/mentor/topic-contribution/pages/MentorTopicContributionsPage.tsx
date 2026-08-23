import { FileCheck2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";
import EmptyState from "../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../shared/LoadingSpinner.tsx";
import { getPendingTopicContributions } from "../../../../api/mentorTopicContribution.api.ts";
import PendingContributionCard from "../components/PendingContributionCard.tsx";
import type { TopicContributionPendingResponse } from "../../../../types/topicContribution.types.ts";

type TypeFilter = "all" | "topic" | "subtopic";

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
            const matchesType =
                typeFilter === "all" ||
                contribution.contributionType
                    .toLowerCase()
                    .includes(typeFilter === "subtopic" ? "sub" : "topic");

            const query = search.trim().toLowerCase();
            const matchesSearch =
                query.length === 0 ||
                contribution.title.toLowerCase().includes(query) ||
                contribution.description.toLowerCase().includes(query);

            return matchesType && matchesSearch;
        });
    }, [contributions, search, typeFilter]);

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 py-5">
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
                        <div className="relative">
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
                                    w-64 rounded-[var(--cs-radius-control)]
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
                    <div className="mt-5 flex flex-wrap gap-1.5">
                        {[
                            { key: "all" as const, label: "All", count: contributions.length },
                            { key: "topic" as const, label: "Topics", count: typeCounts.topic },
                            { key: "subtopic" as const, label: "SubTopics", count: typeCounts.subtopic },
                        ].map((entry) => {
                            const isActive = typeFilter === entry.key;
                            return (
                                <button
                                    key={entry.key}
                                    type="button"
                                    onClick={() => setTypeFilter(entry.key)}
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                        isActive
                                            ? "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]"
                                            : "border-[var(--cs-border)] bg-transparent text-[var(--cs-text-secondary)] hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                                    }`}
                                >
                                    {entry.label}
                                    <span className="font-[var(--cs-font-mono)] text-[10px] text-[var(--cs-text-muted)]">
                                        {entry.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

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
                    <div className="mx-auto max-w-4xl space-y-3">
                        <p className="text-xs text-[var(--cs-text-muted)]">
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
                            <div className="space-y-3">
                                {filteredContributions.map((contribution) => (
                                    <PendingContributionCard
                                        key={contribution.id}
                                        contribution={contribution}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
