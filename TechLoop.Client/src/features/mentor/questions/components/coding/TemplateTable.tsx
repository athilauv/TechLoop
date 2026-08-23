import { Edit3, Trash2 } from "lucide-react";

import type { MentorCodingTemplate } from "../../../../../types/question.types.ts";

interface TemplateTableProps {
    templates: MentorCodingTemplate[];
    technologyName: string;
    onEdit: (template: MentorCodingTemplate) => void;
    onDelete: (template: MentorCodingTemplate) => void;
    disabled?: boolean;
}

const TemplateTable = ({
                           templates,
                           technologyName,
                           onEdit,
                           onDelete,
                           disabled = false,
                       }: TemplateTableProps) => {
    return (
        <div className="overflow-hidden rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface)]/25">
            <table className="w-full text-left text-sm">
                <thead>
                <tr className="border-b border-[var(--cs-border)] text-xs uppercase tracking-wide text-[var(--cs-text-muted)]">
                    <th className="px-4 py-3 font-medium">Language</th>
                    <th className="px-4 py-3 font-medium">Starter Preview</th>
                    <th className="px-4 py-3 font-medium">Solution</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
                </thead>
                <tbody>
                {templates.map((template) => (
                    <tr
                        key={template.id}
                        className="border-b border-[var(--cs-border)] last:border-b-0"
                    >
                        <td className="px-4 py-3 font-medium text-[var(--cs-text)]">
                            {technologyName}
                        </td>
                        <td className="max-w-[280px] px-4 py-3">
                            <code className="block truncate font-mono text-xs text-[var(--cs-text-secondary)]">
                                {template.starterCode || "—"}
                            </code>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--cs-text-muted)]">
                            {template.solutionCode ? "Provided" : "Not provided"}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => onEdit(template)}
                                    disabled={disabled}
                                    aria-label="Edit coding template"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(template)}
                                    disabled={disabled}
                                    aria-label="Delete coding template"
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

export default TemplateTable;
