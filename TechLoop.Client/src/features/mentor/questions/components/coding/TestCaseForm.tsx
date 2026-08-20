import { useState } from "react";
import Button from "../../../../../shared/Button";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import { validateTestCase } from "../../../../../validations/coding.validation.ts";
import type { CreateTestCaseRequest, MentorTestCase, UpdateTestCaseRequest } from "../../../../../types/question.types.ts";

interface TestCaseFormProps {
    testCase?: MentorTestCase;
    position: number;
    submitting?: boolean;
    onSubmit: (request: | CreateTestCaseRequest | UpdateTestCaseRequest,) => Promise<void>;
    onCancel: () => void;
}

const TestCaseForm = ({
                          testCase,
                          position,
                          submitting = false,
                          onSubmit,
                          onCancel,
                      }: TestCaseFormProps) => {
    const [input, setInput] = useState(
        testCase?.input ?? "",
    );

    const [expectedOutput, setExpectedOutput] = useState(
        testCase?.expectedOutput ?? "",
    );

    const [isHidden, setIsHidden] = useState(
        testCase?.isHidden ?? false,
    );

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const trimmedInput = input.trim();
        const trimmedExpectedOutput = expectedOutput.trim();

        const validationError = validateTestCase(
            trimmedInput,
            trimmedExpectedOutput,
            position,
        );

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        try {
            await onSubmit({
                input: trimmedInput,
                expectedOutput: trimmedExpectedOutput,
                isHidden,
                position,
            });
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to save test case.",
                ),
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] p-5"
        >
            <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                {testCase
                    ? "Edit Test Case"
                    : "Add Test Case"}
            </h3>

            <div className="mt-5 space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Input
                    </label>

                    <textarea
                        value={input}
                        onChange={(event) =>
                            setInput(event.target.value)
                        }
                        required
                        rows={5}
                        className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Expected Output
                    </label>

                    <textarea
                        value={expectedOutput}
                        onChange={(event) =>
                            setExpectedOutput(
                                event.target.value,
                            )
                        }
                        required
                        rows={5}
                        className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-[var(--cs-text-secondary)]">
                    <input
                        type="checkbox"
                        checked={isHidden}
                        onChange={(event) =>
                            setIsHidden(
                                event.target.checked,
                            )
                        }
                    />

                    Hidden test case
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
                            !input.trim() ||
                            !expectedOutput.trim()
                        }
                    >
                        {submitting
                            ? "Saving..."
                            : testCase
                                ? "Update Test Case"
                                : "Add Test Case"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TestCaseForm;