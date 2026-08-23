import { Brain, ChevronRight, Code2, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../shared/Breadcrumb.tsx";

interface QuestionTypeCardProps {
    title: string;
    description: string;
    icon: typeof FileQuestion;
    onClick: () => void;
    available?: boolean;
}

const QuestionTypeCard = ({
                              title,
                              description,
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
                "group w-full rounded-xl border p-6 text-left transition-all",
                available
                    ? "border-[var(--cs-border)] bg-[var(--cs-surface)] hover:-translate-y-0.5 hover:border-[var(--cs-primary)]/40 hover:bg-[var(--cs-surface-muted)]"
                    : "cursor-not-allowed border-[var(--cs-border)] bg-[var(--cs-surface)] opacity-60",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] text-[var(--cs-primary)]">
                    <Icon size={23} />
                </div>

                {available ? (
                    <ChevronRight
                        size={19}
                        className="mt-1 shrink-0 text-[var(--cs-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--cs-primary,00e5c0)]"
                    />
                ) : (
                    <span className="rounded-full border border-[var(--cs-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)]">
                        Coming Soon
                    </span>
                )}
            </div>

            <h2 className="mt-5 text-base font-semibold text-[var(--cs-text)]">{title}</h2>

            <p className="mt-2 text-sm leading-6 text-[var(--cs-text-muted)]">{description}</p>

            {available && (
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--cs-primary)]">
                    Manage questions
                    <ChevronRight size={14} />
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
                        description="Create multiple-choice questions with up to four answer options and mark the correct answer."
                        icon={FileQuestion}
                        onClick={() => navigate("/mentor/questions/mcq")}
                    />

                    <QuestionTypeCard
                        title="Coding"
                        description="Create programming questions with coding templates and test cases."
                        icon={Code2}
                        onClick={() => navigate("/mentor/questions/coding")}
                    />

                    <QuestionTypeCard
                        title="Challenge"
                        description="Create advanced challenge questions for learners."
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
