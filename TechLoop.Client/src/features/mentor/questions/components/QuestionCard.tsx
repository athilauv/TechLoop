import {
    ChevronRight,
    FileQuestion,
} from "lucide-react";

import type {
    MentorQuestion,
} from "../../../../types/question.types.ts";

import DifficultyBadge from "./DifficultyBadge";
import QuestionStatusBadge from "./QuestionStatusBadge";
import QuestionTypeBadge from "./QuestionTypeBadge";

interface QuestionCardProps {
    question: MentorQuestion;
    basePath: string;
}

const QuestionCard = ({
                          question,
                          basePath,
                      }: QuestionCardProps) => {
    const href = `${basePath}/${question.id}`;

    const handleClick = () => {
        window.location.href = href;
    };

    return (
        <article
            className="group rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 transition-all hover:border-[var(--cs-primary)]/40 hover:bg-[var(--cs-surface-muted)]"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] text-[var(--cs-primary)]">
                    <FileQuestion size={20} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <DifficultyBadge
                            difficulty={
                                question.difficulty
                            }
                        />

                        <QuestionStatusBadge
                            publishedAt={
                                question.publishedAt ??
                                null
                            }
                        />

                        <QuestionTypeBadge
                            type={
                                question.questionType
                            }
                        />
                    </div>

                    <h3 className="mt-3 text-base font-semibold text-[var(--cs-text)] transition-colors group-hover:text-[var(--cs-primary)]">
                        {question.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--cs-text-muted)]">
                        {question.description ||
                            "No description available."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--cs-text-muted)]">
                        <span>
                            Marks:{" "}
                            <span className="font-medium text-[var(--cs-text-secondary)]">
                                {question.mark}
                            </span>
                        </span>

                        <span>
                            Position:{" "}
                            <span className="font-medium text-[var(--cs-text-secondary)]">
                                {question.position}
                            </span>
                        </span>

                        <span className="max-w-[240px] truncate">
                            Slug:{" "}
                            <span className="font-medium text-[var(--cs-text-secondary)]">
                                {question.slug}
                            </span>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClick}
                    className="mt-1 shrink-0 rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                    aria-label={`Open ${question.title}`}
                >
                    <ChevronRight
                        size={19}
                    />
                </button>
            </div>
        </article>
    );
};

export default QuestionCard;