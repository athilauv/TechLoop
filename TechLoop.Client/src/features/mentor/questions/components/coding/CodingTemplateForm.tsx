import { useState, type FormEvent } from "react";

import Button from "../../../../../shared/Button.tsx";
import { showToast } from "../../../../../utils/toast.tsx";
import { validateCodingTemplate } from "../../../../../validations/coding.validation.ts";

import type {
    CreateCodingTemplateRequest,
    MentorCodingTemplate,
    UpdateCodingTemplateRequest,
} from "../../../../../types/question.types.ts";

interface CodingTemplateFormProps {
    template?: MentorCodingTemplate;
    technologyId: number;
    technologyName: string;
    submitting?: boolean;
    onSubmit: (
        request: CreateCodingTemplateRequest | UpdateCodingTemplateRequest,
    ) => Promise<void>;
    onCancel: () => void;
}

const CodingTemplateForm = ({
                                template,
                                technologyId,
                                technologyName,
                                submitting = false,
                                onSubmit,
                                onCancel,
                            }: CodingTemplateFormProps) => {
    const [starterCode, setStarterCode] = useState(template?.starterCode ?? "");
    const [executionCode, setExecutionCode] = useState(template?.executionCode ?? "");
    const [solutionCode, setSolutionCode] = useState(template?.solutionCode ?? "");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedStarterCode = starterCode.trim();
        const trimmedExecutionCode = executionCode.trim();
        const trimmedSolutionCode = solutionCode.trim();

        if (technologyId <= 0) {
            showToast.error("Technology could not be determined.");
            return;
        }

        const validationError = validateCodingTemplate(
            technologyId,
            trimmedStarterCode,
            trimmedExecutionCode,
            trimmedSolutionCode || null,
        );

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        await onSubmit({
            technologyId,
            starterCode: trimmedStarterCode,
            executionCode: trimmedExecutionCode,
            solutionCode: trimmedSolutionCode || null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)]/45 px-3 py-2.5">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--cs-text)]">
                        {technologyName}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--cs-text-muted)]">
                        Automatically assigned from your mentor technology
                    </p>
                </div>
                <span className="ml-3 shrink-0 rounded-full border border-[var(--cs-primary)]/20 bg-[var(--cs-primary)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--cs-primary)]">
                    Auto
                </span>
            </div>

            <div>
                <label htmlFor="starter-code" className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Starter Code
                </label>
                <textarea
                    id="starter-code"
                    value={starterCode}
                    onChange={(event) => setStarterCode(event.target.value)}
                    required
                    maxLength={50000}
                    rows={12}
                    disabled={submitting}
                    placeholder="Enter starter code..."
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/45 px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] focus:ring-1 focus:ring-[var(--cs-primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div>
                <label htmlFor="execution-code" className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Execution Code
                </label>
                <textarea
                    id="execution-code"
                    value={executionCode}
                    onChange={(event) => setExecutionCode(event.target.value)}
                    required
                    maxLength={50000}
                    rows={12}
                    disabled={submitting}
                    placeholder="Use {{USER_CODE}} where learner code should be inserted..."
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/45 px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] focus:ring-1 focus:ring-[var(--cs-primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div>
                <label htmlFor="solution-code" className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Solution Code
                </label>
                <textarea
                    id="solution-code"
                    value={solutionCode}
                    onChange={(event) => setSolutionCode(event.target.value)}
                    maxLength={50000}
                    rows={12}
                    disabled={submitting}
                    placeholder="Enter solution code..."
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/45 px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] focus:ring-1 focus:ring-[var(--cs-primary)]/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--cs-border)] pt-5">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting || technologyId <= 0 || !starterCode.trim() || !executionCode.trim()}>
                    {submitting ? "Saving..." : template ? "Update Template" : "Add Template"}
                </Button>
            </div>
        </form>
    );
};

export default CodingTemplateForm;
