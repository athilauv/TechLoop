import { useState } from "react";
import Button from "../../../../../shared/Button.tsx";
import { showToast } from "../../../../../utils/toast.tsx";
import { validateTestCase } from "../../../../../validations/coding.validation.ts";
import type {
    CreateTestCaseRequest,
    MentorTestCase,
    UpdateTestCaseRequest,
} from "../../../../../types/question.types.ts";

interface TestCaseFormProps {
    testCase?: MentorTestCase;
    position: number;
    submitting?: boolean;
    onSubmit: (request: CreateTestCaseRequest | UpdateTestCaseRequest) => Promise<void>;
    onCancel: () => void;
}

const TestCaseForm = ({
                          testCase,
                          position,
                          submitting = false,
                          onSubmit,
                          onCancel,
                      }: TestCaseFormProps) => {
    const [input, setInput] = useState(testCase?.input ?? "");
    const [expectedOutput, setExpectedOutput] = useState(testCase?.expectedOutput ?? "");
    const [isHidden, setIsHidden] = useState(testCase?.isHidden ?? false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedInput = input.trim();
        const trimmedExpectedOutput = expectedOutput.trim();

        const validationError = validateTestCase(trimmedInput, trimmedExpectedOutput, position);

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        await onSubmit({
            input: trimmedInput,
            expectedOutput: trimmedExpectedOutput,
            isHidden,
            position,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="test-case-input" className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Input
                </label>
                <textarea
                    id="test-case-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    required
                    rows={5}
                    disabled={submitting}
                    placeholder="Enter test case input..."
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/45 px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <div>
                <label htmlFor="expected-output" className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Expected Output
                </label>
                <textarea
                    id="expected-output"
                    value={expectedOutput}
                    onChange={(event) => setExpectedOutput(event.target.value)}
                    required
                    rows={5}
                    disabled={submitting}
                    placeholder="Enter expected output..."
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/45 px-3 py-3 font-mono text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--cs-text-secondary)]">
                <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={(event) => setIsHidden(event.target.checked)}
                    disabled={submitting}
                    className="h-4 w-4 rounded border-[var(--cs-border)]"
                />
                Hidden test case
            </label>

            <div className="flex justify-end gap-2 border-t border-[var(--cs-border)] pt-5">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit"
                    disabled={submitting || !input.trim() || !expectedOutput.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--cs-primary-contrast)] transition-colors duration-150 hover:bg-[var(--cs-primary-hover,var(--cs-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40">
                    {submitting ? "Saving..." : testCase ? "Update Test Case" : "Add Test Case"}
                </Button>
            </div>
        </form>
    );
};

export default TestCaseForm;
