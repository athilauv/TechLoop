import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import TopicContributionForm from "../components/TopicContributionForm.tsx";

export default function CreateTopicContributionPage() {
    const navigate = useNavigate();

    return (
        <div className="content-studio-theme flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--cs-border)] px-7 py-5">
                <button
                    type="button"
                    onClick={() => navigate("/learner/topic-contributions")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--cs-text-secondary)] transition hover:text-[var(--cs-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-accent)]/40 rounded"
                >
                    <ArrowLeft size={16} />
                    Back to contributions
                </button>

                <p className="mt-3 font-[var(--cs-font-mono)] text-[11px] uppercase tracking-widest text-[var(--cs-text-muted)]">
                    learner / contributions / new
                </p>
                <h1 className="mt-1.5 text-2xl font-semibold text-[var(--cs-text-primary)]">
                    New Contribution
                </h1>
                <p className="mt-1 text-sm text-[var(--cs-text-secondary)]">
                    Stage where it belongs, compose the content, then push it for review.
                </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">
                <div className="mx-auto w-full max-w-3xl">
                    <TopicContributionForm />
                </div>
            </div>
        </div>
    );
}
