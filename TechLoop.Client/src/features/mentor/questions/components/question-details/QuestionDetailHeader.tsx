import { Edit3, Trash2 } from "lucide-react";

import Button from "../../../../../shared/Button.tsx";
import type { MentorQuestion } from "../../../../../types/question.types.ts";

import DifficultyBadge from "../badges/DifficultyBadge";
import QuestionStatusBadge from "../badges/QuestionStatusBadge";
import QuestionTypeBadge from "../badges/QuestionTypeBadge";

interface QuestionDetailHeaderProps {
    question: MentorQuestion;
    onEdit: () => void;
    onDelete: () => void;
    onPublish: () => void;
    publishing?: boolean;
}

const QuestionDetailHeader = ({
                                  question,
                                  onEdit,
                                  onDelete,
                                  onPublish,
                                  publishing = false,
                              }: QuestionDetailHeaderProps) => {
    const isPublished = Boolean(question.publishedAt);

    return (
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <QuestionTypeBadge type={question.questionType} />
                    <DifficultyBadge difficulty={question.difficulty} />
                    <QuestionStatusBadge publishedAt={question.publishedAt ?? null} />
                </div>

                <h1 className="text-2xl font-bold text-[var(--cs-text)]">
                    {question.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--cs-text-muted)]">
                    {question.description || "No description available."}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {!isPublished && (
                    <Button type="button" onClick={onPublish} disabled={publishing}>
                        {publishing ? "Publishing..." : "Publish"}
                    </Button>
                )}

                <Button type="button" variant="secondary" onClick={onEdit}>
                    <Edit3 size={16} className="mr-1.5 inline" />
                    Edit
                </Button>

                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Delete question"
                    className="rounded-lg border border-[var(--cs-border)] p-2.5 text-[var(--cs-text-muted)] transition-colors hover:border-[var(--cs-danger)]/30 hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)]"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default QuestionDetailHeader;
