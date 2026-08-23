import { ArrowRight, GitCommitVertical, Plus } from "lucide-react";

interface TopicContributionEmptyStateProps {
    onCreate: () => void;
}

export default function TopicContributionEmptyState({
                                                        onCreate,
                                                    }: TopicContributionEmptyStateProps) {
    return (
        <div className="mx-auto max-w-2xl rounded-[var(--cs-radius-card)] border border-dashed border-[var(--cs-border)] bg-[var(--cs-bg-card)]/60 px-6 py-16 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-bg-surface)]">
                <GitCommitVertical size={26} strokeWidth={1.8} className="text-[var(--cs-accent)]" />
            </div>

            <p className="mt-6 font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                empty ledger
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[var(--cs-text-primary)]">
                Nothing pushed yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--cs-text-secondary)]">
                Share a topic, a subtopic, or a clearer explanation with the
                community. Every contribution here goes through mentor
                review before it lands.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["Topics", "Explanations", "Examples", "References"].map((label) => (
                    <span
                        key={label}
                        className="rounded-full border border-[var(--cs-border)] bg-[var(--cs-bg-input)] px-3 py-1.5 text-xs font-medium text-[var(--cs-text-secondary)]"
                    >
                        {label}
                    </span>
                ))}
            </div>

            <button
                type="button"
                onClick={onCreate}
                className="group mt-8 inline-flex items-center gap-2 rounded-[var(--cs-radius-control)] bg-[var(--cs-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--cs-accent-on)] transition hover:bg-[var(--cs-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cs-bg-page)]"
            >
                <Plus size={16} />
                Start Contributing
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
        </div>
    );
}
