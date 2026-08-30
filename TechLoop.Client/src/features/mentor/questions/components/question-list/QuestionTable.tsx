import { Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { MentorQuestion } from "../../../../../types/question.types.ts";

import DifficultyBadge from "../badges/DifficultyBadge";
import QuestionStatusBadge from "../badges/QuestionStatusBadge";
import HorizontalScrollArea from "../shared/HorizontalScrollArea";

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
    const getDetailsPath = (question: MentorQuestion) =>
        `${basePath}/${basePath.includes("/coding") ? question.slug : question.id}`;

    return (
        <>
            <div className="hidden sm:block">
                <HorizontalScrollArea>
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                    <tr className="border-b border-[var(--cs-border)]/70 text-xs uppercase tracking-wide text-[var(--cs-text-muted)]">
                        <th className="px-5 py-3 font-medium">Title</th>
                        <th className="px-5 py-3 font-medium">Difficulty</th>
                        <th className="px-5 py-3 font-medium">Marks</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="hidden px-5 py-3 font-medium lg:table-cell">Slug</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {questions.map((question) => (
                        <tr
                            key={question.id}
                            onClick={() => navigate(getDetailsPath(question))}
                            className="cursor-pointer border-b border-[var(--cs-border)]/70 transition-colors last:border-b-0 hover:bg-[var(--cs-surface-muted)]"
                        >
                            <td className="max-w-[320px] px-5 py-3">
                                <p className="truncate font-medium text-[var(--cs-text)]">
                                    {question.title}
                                </p>
                            </td>

                            <td className="px-5 py-3">
                                <DifficultyBadge difficulty={question.difficulty} />
                            </td>

                            <td className="px-5 py-3 text-[var(--cs-text-secondary)]">
                                {question.mark}
                            </td>

                            <td className="px-5 py-3">
                                <QuestionStatusBadge publishedAt={question.publishedAt ?? null} />
                            </td>

                            <td className="hidden max-w-[180px] truncate px-5 py-3 text-[var(--cs-text-muted)] lg:table-cell">
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
                </HorizontalScrollArea>
            </div>

            <div className="divide-y divide-[var(--cs-border)]/70 sm:hidden">
                {questions.map((question) => (
                    <div
                        key={question.id}
                        onClick={() => navigate(getDetailsPath(question))}
                        className="cursor-pointer px-4 py-4 transition-colors hover:bg-[var(--cs-surface-muted)]"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate font-medium text-[var(--cs-text)]">
                                    {question.title}
                                </p>
                            </div>

                            <div
                                className="flex shrink-0 items-center gap-1"
                                onClick={(event) => event.stopPropagation()}
                            >

                                <button
                                    type="button"
                                    onClick={() => onEdit(question)}
                                    disabled={disabled}
                                    aria-label="Edit question"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface)] hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 size={15} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(question)}
                                    disabled={disabled}
                                    aria-label="Delete question"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <DifficultyBadge difficulty={question.difficulty} />
                            <QuestionStatusBadge publishedAt={question.publishedAt ?? null} />
                            <span className="text-xs text-[var(--cs-text-muted)]">
                                Marks: {question.mark}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default QuestionTable;
