import { Edit3, Eye, EyeOff, Trash2 } from "lucide-react";

import type { MentorTestCase } from "../../../../../types/question.types.ts";
import HorizontalScrollArea from "../shared/HorizontalScrollArea";

interface TestCaseTableProps {
    testCases: MentorTestCase[];
    onEdit: (testCase: MentorTestCase) => void;
    onDelete: (id: number) => void;
    disabled?: boolean;
}

const TestCaseTable = ({
                           testCases,
                           onEdit,
                           onDelete,
                           disabled = false,
                       }: TestCaseTableProps) => {
    return (
        <div className="rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface)]/25">
            <HorizontalScrollArea>
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                <tr className="border-b border-[var(--cs-border)] text-xs uppercase tracking-wide text-[var(--cs-text-muted)]">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Input</th>
                    <th className="px-4 py-3 font-medium">Expected Output</th>
                    <th className="px-4 py-3 font-medium">Visibility</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
                </thead>
                <tbody>
                {testCases.map((testCase) => (
                    <tr
                        key={testCase.id}
                        className="border-b border-[var(--cs-border)] last:border-b-0"
                    >
                        <td className="px-4 py-3 font-medium text-[var(--cs-text)]">
                            {testCase.position}
                        </td>
                        <td className="max-w-[220px] px-4 py-3">
                            <code className="block truncate font-mono text-xs text-[var(--cs-text-secondary)]">
                                {testCase.input}
                            </code>
                        </td>
                        <td className="max-w-[220px] px-4 py-3">
                            <code className="block truncate font-mono text-xs text-[var(--cs-text-secondary)]">
                                {testCase.expectedOutput}
                            </code>
                        </td>
                        <td className="px-4 py-3">
                            {testCase.isHidden ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                        <EyeOff size={11} />
                                        Hidden
                                    </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                        <Eye size={11} />
                                        Visible
                                    </span>
                            )}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => onEdit(testCase)}
                                    disabled={disabled}
                                    aria-label="Edit test case"
                                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(testCase.id)}
                                    disabled={disabled}
                                    aria-label="Delete test case"
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
    );
};

export default TestCaseTable;
