import { useState } from "react";
import Button from "../../../../../shared/Button";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import { validateMcqOption } from "../../../../../validations/mcq.validation.ts";
import type {
    CreateMcqOptionRequest,
    MentorMcqOption,
    UpdateMcqOptionRequest,
} from "../../../../../types/question.types.ts";

interface McqOptionFormProps {
    option?: MentorMcqOption;
    position: number;
    submitting?: boolean;
    onSubmit: (
        request: CreateMcqOptionRequest | UpdateMcqOptionRequest,
    ) => Promise<void>;
    onCancel: () => void;
}

const McqOptionForm = ({
                           option,
                           position,
                           submitting = false,
                           onSubmit,
                           onCancel,
                       }: McqOptionFormProps) => {
    const [optionText, setOptionText] = useState(
        option?.optionText ?? "",
    );

    const [isCorrect, setIsCorrect] = useState(
        option?.isCorrect ?? false,
    );

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const trimmedOptionText = optionText.trim();

        const validationError = validateMcqOption(
            trimmedOptionText,
            position,
        );

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        try {
            await onSubmit({
                optionText: trimmedOptionText,
                isCorrect,
                position,
            });
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to save answer option.",
                ),
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] p-5"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                    {option
                        ? "Edit Option"
                        : "Add Option"}
                </h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Option{" "}
                        {String.fromCharCode(
                            64 + position,
                        )}
                    </label>

                    <input
                        type="text"
                        value={optionText}
                        onChange={(event) =>
                            setOptionText(
                                event.target.value,
                            )
                        }
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
                        onChange={(event) =>
                            setIsCorrect(
                                event.target.checked,
                            )
                        }
                        disabled={submitting}
                    />

                    Mark as correct answer
                </label>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            submitting ||
                            !optionText.trim()
                        }
                    >
                        {submitting
                            ? "Saving..."
                            : option
                                ? "Update Option"
                                : "Add Option"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default McqOptionForm;