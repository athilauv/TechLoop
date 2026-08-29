import { Brain, ChevronRight, Code2, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";

interface QuestionTypeCardProps {
    title: string;
    description: string;
    features?: string[];
    icon: typeof FileQuestion;
    onClick: () => void;
    available?: boolean;
}

const QuestionTypeCard = ({
                              title,
                              description,
                              features,
                              icon: Icon,
                              onClick,
                              available = true,
                          }: QuestionTypeCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!available}
            className={[
                "group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-200",
                "bg-[var(--cs-surface)] ring-1 ring-inset ring-[var(--cs-border)]/60",
                available
                    ? "hover:-translate-y-0.5 hover:bg-[var(--cs-surface-muted)] hover:ring-[var(--cs-primary)]/50 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.6)]"
                    : "cursor-not-allowed opacity-60",
            ].join(" ")}
        >
            {available && (
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--cs-primary)]/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:via-[var(--cs-primary)]/40 group-hover:opacity-100" />
            )}

            <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cs-primary)]/12 text-[var(--cs-primary)] transition-colors group-hover:bg-[var(--cs-primary)]/18">
                    <Icon size={22} />
                </div>

                {available ? (
                    <ChevronRight
                        size={18}
                        className="mt-1.5 shrink-0 text-[var(--cs-text-muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--cs-primary)]"
                    />
                ) : (
                    <span className="rounded-full bg-[var(--cs-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)] ring-1 ring-inset ring-[var(--cs-border)]/60">
                        Coming Soon
                    </span>
                )}
            </div>

            <h2 className="mt-5 text-base font-semibold text-[var(--cs-text)]">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-[var(--cs-text-muted)]">{description}</p>

            {features && features.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                    {features.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-center gap-2 text-xs text-[var(--cs-text-secondary)]"
                        >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--cs-primary)]" />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            {available ? (
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cs-primary)]">
                    Manage questions
                    <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
            ) : (
                <span className="mt-5 block text-xs font-medium text-[var(--cs-text-muted)]">
                    Not available yet
                </span>
            )}
        </button>
    );
};

const QuestionTypePickerPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb items={[{ label: "Questions" }]} />

            <div className="mx-auto mt-6 max-w-6xl">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--cs-text)]">Questions</h1>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--cs-text-muted)]">
                        Create and manage questions for learners across different question types.
                    </p>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <QuestionTypeCard
                        title="MCQ"
                        description="Multiple-choice questions for quick knowledge checks."
                        features={[
                            "Up to four answer options",
                            "Mark the correct answer",
                        ]}
                        icon={FileQuestion}
                        onClick={() => navigate("/mentor/questions/mcq")}
                    />

                    <QuestionTypeCard
                        title="Coding"
                        description="Programming questions for hands-on practice."
                        features={[
                            "Starter & solution templates",
                            "Automated test cases",
                        ]}
                        icon={Code2}
                        onClick={() => navigate("/mentor/questions/coding")}
                    />

                    <QuestionTypeCard
                        title="Challenge"
                        description="Advanced, multi-step challenge questions for learners."
                        icon={Brain}
                        available={false}
                        onClick={() => undefined}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionTypePickerPage;
