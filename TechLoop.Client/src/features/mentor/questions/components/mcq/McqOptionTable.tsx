import { CheckCircle2, Edit3, Trash2 } from "lucide-react";
import type { MentorMcqOption } from "../../../../../types/question.types.ts";

interface McqOptionTableProps {
    options: MentorMcqOption[];
    onEdit: (option: MentorMcqOption) => void;
    onDelete: (optionId: number) => void;
    disabled?: boolean;
}

const McqOptionTable = ({
                            options,
                            onEdit,
                            onDelete,
                            disabled = false,
                        }: McqOptionTableProps) => {
    return (
        <div className="overflow-hidden rounded-lg border border-[var(--cs-border)]">
            <table className="w-full text-left text-sm">
                <thead>
                <tr className="border-b border-[var(--cs-border)] text-xs uppercase tracking-wide text-[var(--cs-text-muted)]">
                    <th className="px-4 py-3 font-medium">Option</th>
                    <th className="px-4 py-3 font-medium">Text</th>
                    <th className="px-4 py-3 font-medium">Correct</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
                </thead>
                <tbody>
                {options.map((option, index) => (
                    <tr
                        key={option.id}
                        className="border-b border-[var(--cs-border)] last:border-b-0"
                    >
                        <td className="px-4 py-3 font-semibold text-[var(--cs-text)]">
                            {String.fromCharCode(65 + index)}
                        </td>
                        <td className="px-4 py-3 text-[var(--cs-text)]">
                            {option.optionText}
                        </td>
                        <td className="px-4 py-3">
                            {option.isCorrect ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--cs-success-border)] bg-[var(--cs-success-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--cs-success)]">
                                        <CheckCircle2 size={13} />
                                        Correct
                                    </span>
                            ) : (
                                <span className="text-xs text-[var(--cs-text-muted)]">—</span>
                            )}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => onEdit(option)}
                                    disabled={disabled}
                                    aria-label="Edit option"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(option.id)}
                                    disabled={disabled}
                                    aria-label="Delete option"
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

export default McqOptionTable;
