import { useState } from "react";
import Button from "../../../../../shared/Button.tsx";
import { validateMcqOption } from "../../../../../validations/mcq.validation.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type {
    CreateMcqOptionRequest,
    MentorMcqOption,
    UpdateMcqOptionRequest,
} from "../../../../../types/question.types.ts";

interface McqOptionFormProps {
    option?: MentorMcqOption;
    position: number;
    submitting?: boolean;
    onSubmit: (request: CreateMcqOptionRequest | UpdateMcqOptionRequest) => Promise<void>;
    onCancel: () => void;
}

const McqOptionForm = ({
                           option,
                           position,
                           submitting = false,
                           onSubmit,
                           onCancel,
                       }: McqOptionFormProps) => {
    const [optionText, setOptionText] = useState(option?.optionText ?? "");
    const [isCorrect, setIsCorrect] = useState(option?.isCorrect ?? false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedOptionText = optionText.trim();
        const validationError = validateMcqOption(trimmedOptionText, position);

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        await onSubmit({
            optionText: trimmedOptionText,
            isCorrect,
            position,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Option {String.fromCharCode(64 + position)}
                </label>
                <input
                    type="text"
                    value={optionText}
                    onChange={(event) => setOptionText(event.target.value)}
                    placeholder="Enter answer option"
                    autoFocus
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--cs-text-secondary)]">
                <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={(event) => setIsCorrect(event.target.checked)}
                    disabled={submitting}
                />
                Mark as correct answer
            </label>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>

                <Button type="submit" disabled={submitting || !optionText.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[var(--cs-primary,#00C9A7)] bg-[var(--cs-primary,#00C9A7)] px-3.5 py-2 text-sm font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)]">
                    {submitting ? "Saving..." : option ? "Update Option" : "Add Option"}
                </Button>
            </div>
        </form>
    );
};

export default McqOptionForm;
