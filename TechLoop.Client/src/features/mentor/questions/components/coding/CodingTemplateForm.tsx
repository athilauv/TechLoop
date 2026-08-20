import { useState } from "react";
import Button from "../../../../../shared/Button";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import { validateCodingTemplate } from "../../../../../validations/coding.validation.ts";
import type { CreateCodingTemplateRequest, MentorCodingTemplate, UpdateCodingTemplateRequest } from "../../../../../types/question.types.ts";

interface CodingTemplateFormProps {
    template?: MentorCodingTemplate;
    submitting?: boolean;
    onSubmit: (request: | CreateCodingTemplateRequest | UpdateCodingTemplateRequest,) => Promise<void>;
    onCancel: () => void;
}

const CodingTemplateForm = ({
                                template,
                                submitting = false,
                                onSubmit,
                                onCancel,
                            }: CodingTemplateFormProps) => {
    const [technologyId, setTechnologyId] = useState<number>(
        template?.technologyId ?? 0,
    );

    const [starterCode, setStarterCode] = useState(
        template?.starterCode ?? "",
    );

    const [solutionCode, setSolutionCode] = useState(
        template?.solutionCode ?? "",
    );

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const trimmedStarterCode = starterCode.trim();
        const trimmedSolutionCode = solutionCode.trim();

        const validationError = validateCodingTemplate(
            technologyId,
            trimmedStarterCode,
            trimmedSolutionCode || null,
        );

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        try {
            await onSubmit({
                technologyId,
                starterCode: trimmedStarterCode,
                solutionCode: trimmedSolutionCode || null,
            });
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to save coding template.",),);
        }
    };

    return (
        <form onSubmit={handleSubmit}
            className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] p-5">
            <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                {template ? "Edit Coding Template" : "Add Coding Template"}
            </h3>

            <div className="mt-5 space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Technology ID
                    </label>

                    <input
                        type="number"
                        min={1}
                        value={technologyId || ""}
                        onChange={(event) => setTechnologyId(Number(event.target.value),)}
                        required
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Starter Code
                    </label>

                    <textarea
                        value={starterCode}
                        onChange={(event) => setStarterCode(event.target.value)}
                        required
                        maxLength={50000}
                        rows={10}
                        className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Solution Code
                    </label>

                    <textarea
                        value={solutionCode}
                        onChange={(event) => setSolutionCode(event.target.value)}
                        maxLength={50000}
                        rows={10}
                        className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={submitting}>
                        Cancel
                    </Button>

                    <Button type="submit"
                        disabled={submitting || technologyId <= 0 || !starterCode.trim()}>
                        {submitting ? "Saving..." : template ? "Update Template" : "Add Template"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CodingTemplateForm;