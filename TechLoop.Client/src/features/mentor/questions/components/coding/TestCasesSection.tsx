import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import { createTestCase, deleteTestCase, getTestCasesByQuestion, updateTestCase } from "../../../../../api/mentorCoding.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type {CreateTestCaseRequest, MentorTestCase, UpdateTestCaseRequest } from "../../../../../types/question.types.ts";
import TestCaseForm from "./TestCaseForm";

interface TestCasesSectionProps {
    questionId: number;
}

const TestCasesSection = ({
                              questionId,
                          }: TestCasesSectionProps) => {
    const [testCases, setTestCases] = useState<MentorTestCase[]>(
        [],
    );

    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingTestCase, setEditingTestCase] =
        useState<MentorTestCase | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadTestCases = async () => {
        try {
            setLoading(true);

            const result =
                await getTestCasesByQuestion(questionId);

            setTestCases(
                [...result].sort(
                    (a, b) => a.position - b.position,
                ),
            );
        } catch (error) {
            setTestCases([]);

            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to load test cases.",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const result =
                    await getTestCasesByQuestion(questionId);

                if (!cancelled) {
                    setTestCases(
                        [...result].sort(
                            (a, b) =>
                                a.position - b.position,
                        ),
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setTestCases([]);

                    showToast.error(
                        getErrorMessage(
                            error,
                            "Failed to load test cases.",
                        ),
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [questionId]);

    const handleCreate = async (
        request: CreateTestCaseRequest,
    ) => {
        try {
            setSubmitting(true);

            await createTestCase(
                questionId,
                request,
            );

            setFormOpen(false);
            setEditingTestCase(null);

            await loadTestCases();

            showToast.success(
                "Test case created successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to create test case.",
                ),
            );

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (
        request: UpdateTestCaseRequest,
    ) => {
        if (!editingTestCase) {
            return;
        }

        try {
            setSubmitting(true);

            await updateTestCase(
                editingTestCase.id,
                request,
            );

            setFormOpen(false);
            setEditingTestCase(null);

            await loadTestCases();

            showToast.success(
                "Test case updated successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to update test case.",
                ),
            );

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        showToast.confirm(
            "Delete Test Case",
            "Are you sure you want to delete this test case? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteTestCase(id);

                        await loadTestCases();

                        showToast.success(
                            "Test case deleted successfully.",
                        );
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(
                                error,
                                "Failed to delete test case.",
                            ),
                        );
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    const openCreate = () => {
        setEditingTestCase(null);
        setFormOpen(true);
    };

    const openEdit = (
        testCase: MentorTestCase,
    ) => {
        setEditingTestCase(testCase);
        setFormOpen(true);
    };

    const nextPosition =
        testCases.length > 0
            ? Math.max(
            ...testCases.map(
                (testCase) =>
                    testCase.position,
            ),
        ) + 1
            : 1;

    return (
        <section className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-[var(--cs-text)]">
                        Test Cases
                    </h2>

                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        Define inputs and expected outputs
                        used to evaluate submissions.
                    </p>
                </div>

                {!formOpen && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-border)] px-3 py-2 text-sm font-medium text-[var(--cs-text)] transition hover:bg-[var(--cs-surface-muted)]"
                    >
                        <Plus size={16} />
                        Add Test Case
                    </button>
                )}
            </div>

            {formOpen && (
                <div className="mt-5">
                    <TestCaseForm
                        key={
                            editingTestCase?.id ??
                            "new"
                        }
                        testCase={
                            editingTestCase ??
                            undefined
                        }
                        position={
                            editingTestCase?.position ??
                            nextPosition
                        }
                        submitting={submitting}
                        onSubmit={
                            editingTestCase
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={() => {
                            setFormOpen(false);
                            setEditingTestCase(null);
                        }}
                    />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingSpinner />
                </div>
            ) : testCases.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon={
                            <span className="text-lg font-bold">
                                {"</>"}
                            </span>
                        }
                        title="No test cases"
                        description="Add test cases to evaluate coding question submissions."
                    />
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {testCases.map((testCase, index) => (
                        <div
                            key={testCase.id}
                            className="rounded-lg border border-[var(--cs-border)] p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cs-surface-muted)] text-xs font-semibold text-[var(--cs-text)]">
                                        {index + 1}
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-[var(--cs-text)]">
                                            Test Case{" "}
                                            {testCase.position}
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                                testCase.isHidden
                                                    ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                                                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                            }`}
                                        >
                                            {testCase.isHidden
                                                ? "Hidden"
                                                : "Visible"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEdit(
                                                testCase,
                                            )
                                        }
                                        className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                                        aria-label="Edit test case"
                                    >
                                        <Edit3 size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                testCase.id,
                                            )
                                        }
                                        className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)]"
                                        aria-label="Delete test case"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                        Input
                                    </p>

                                    <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--cs-surface-muted)] p-4 text-xs text-[var(--cs-text)]">
                                        {testCase.input}
                                    </pre>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                        Expected Output
                                    </p>

                                    <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--cs-surface-muted)] p-4 text-xs text-[var(--cs-text)]">
                                        {testCase.expectedOutput}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TestCasesSection;