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
                <Breadcrumb
                    items={[{ label: "Mentor" }, { label: "Topic Contributions" }]}
                />

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--cs-text-primary)]">
                            Topic Contributions
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                            Review and manage learner-submitted topic and subtopic
                            contributions.
                        </p>
                    </div>

                    {!loading && !error && contributions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <Search
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search contributions..."
                                    className="
                                        w-56 rounded-[var(--cs-radius-control)]
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

                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    setTypeFilter(event.target.value as TypeFilter)
                                }
                                className="
                                    rounded-[var(--cs-radius-control)]
                                    border border-[var(--cs-border)]
                                    bg-[var(--cs-bg-input)]
                                    px-3 py-2
                                    text-sm text-[var(--cs-text-primary)]
                                    outline-none transition
                                    focus:border-[var(--cs-accent-border)]
                                "
                            >
                                <option value="all">All types</option>
                                <option value="topic">Topics</option>
                                <option value="subtopic">SubTopics</option>
                            </select>
                        </div>
                    )}
                </div>
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
                        title="No pending contributions"
                        description="There are no learner contributions waiting for review."
                    />
                ) : (
                    <div className="mx-auto max-w-5xl space-y-4">
                        <div className="mb-5">
                            <p className="text-sm font-medium text-[var(--cs-text-primary)]">
                                Pending Reviews
                            </p>
                            <p className="mt-1 text-xs text-[var(--cs-text-secondary)]">
                                {filteredContributions.length} of {contributions.length}{" "}
                                contribution{contributions.length !== 1 ? "s" : ""} waiting
                                for review
                            </p>
                        </div>

                        {filteredContributions.length === 0 ? (
                            <EmptyState
                                icon={<Search size={24} />}
                                title="No matching contributions"
                                description="Try adjusting your search or type filter."
                            />
                        ) : (
                            <div className="space-y-4">
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