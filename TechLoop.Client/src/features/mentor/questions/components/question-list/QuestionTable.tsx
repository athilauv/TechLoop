import { Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { MentorQuestion } from "../../../../../types/question.types.ts";

import DifficultyBadge from "../badges/DifficultyBadge";
import QuestionStatusBadge from "../badges/QuestionStatusBadge";

interface QuestionTableProps {
    questions: MentorQuestion[];
    basePath: string;
    onEdit: (question: MentorQuestion) => void;
    onDelete: (question: MentorQuestion) => void;
    disabled?: boolean;
}

const QuestionTable = ({
                           questions,
                           basePath,
                           onEdit,
                           onDelete,
                           disabled = false,
                       }: QuestionTableProps) => {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)]">
            <table className="w-full text-left text-sm">
                <thead>
                <tr className="border-b border-[var(--cs-border)] text-xs uppercase tracking-wide text-[var(--cs-text-muted)]">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Difficulty</th>
                    <th className="px-5 py-3 font-medium">Marks</th>
                    <th className="px-5 py-3 font-medium">Position</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Slug</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
                </thead>

                <tbody>
                {questions.map((question) => (
                    <tr
                        key={question.id}
                        onClick={() => navigate(`${basePath}/${question.id}`)}
                        className="cursor-pointer border-b border-[var(--cs-border)] transition-colors last:border-b-0 hover:bg-[var(--cs-surface-muted)]"
                    >
                        <td className="max-w-[320px] px-5 py-3">
                            <p className="truncate font-medium text-[var(--cs-text)]">
                                {question.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[var(--cs-text-muted)]">
                                {question.description || "No description available."}
                            </p>
                        </td>

                        <td className="px-5 py-3">
                            <DifficultyBadge difficulty={question.difficulty} />
                        </td>

                        <td className="px-5 py-3 text-[var(--cs-text-secondary)]">
                            {question.mark}
                        </td>

                        <td className="px-5 py-3 text-[var(--cs-text-secondary)]">
                            {question.position}
                        </td>

                        <td className="px-5 py-3">
                            <QuestionStatusBadge publishedAt={question.publishedAt ?? null} />
                        </td>

                        <td className="max-w-[180px] px-5 py-3 truncate text-[var(--cs-text-muted)]">
                            {question.slug}
                        </td>

                        <td className="px-5 py-3">
                            <div
                                className="flex items-center justify-end gap-1"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={() => onEdit(question)}
                                    disabled={disabled}
                                    aria-label="Edit question"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface)] hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(question)}
                                    disabled={disabled}
                                    aria-label="Delete question"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionTable;
