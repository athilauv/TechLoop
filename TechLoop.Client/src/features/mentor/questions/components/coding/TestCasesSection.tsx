import { Plus, TestTube2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import Button from "../../../../../shared/Button.tsx";

import {
    createTestCase,
    deleteTestCase,
    getTestCasesByQuestion,
    updateTestCase,
} from "../../../../../api/mentorCoding.api.ts";

import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import type {
    CreateTestCaseRequest,
    MentorTestCase,
    UpdateTestCaseRequest,
} from "../../../../../types/question.types.ts";

import TestCaseTable from "./TestCaseTable";
import TestCaseForm from "./TestCaseForm";

interface TestCasesSectionProps {
    questionId: number;
}

const TestCasesSection = ({ questionId }: TestCasesSectionProps) => {
    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTestCase, setEditingTestCase] = useState<MentorTestCase | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const validQuestionId = Number.isInteger(questionId) && questionId > 0;

    const {
        data: testCases = [],
        isLoading,
        isError,
    } = useQuery<MentorTestCase[]>({
        queryKey: ["mentor-test-cases", questionId],
        queryFn: () => getTestCasesByQuestion(questionId),
        enabled: validQuestionId,
    });

    const sortedTestCases = [...testCases].sort((a, b) => a.position - b.position);

    const nextPosition =
        sortedTestCases.length > 0
            ? Math.max(...sortedTestCases.map((testCase) => testCase.position)) + 1
            : 1;

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingTestCase(null);
    };

    const openCreate = () => {
        setEditingTestCase(null);
        setDrawerOpen(true);
    };

    const openEdit = (testCase: MentorTestCase) => {
        setEditingTestCase(testCase);
        setDrawerOpen(true);
    };

    const invalidateTestCases = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["mentor-test-cases", questionId],
        });
    };

    const handleSubmit = async (request: CreateTestCaseRequest | UpdateTestCaseRequest) => {
        setSubmitting(true);

        try {
            if (editingTestCase) {
                await updateTestCase(editingTestCase.id, {
                    ...request,
                    position: editingTestCase.position,
                });
                showToast.success("Test case updated successfully.");
            } else {
                await createTestCase(questionId, {
                    ...request,
                    position: nextPosition,
                });
                showToast.success("Test case created successfully.");
            }

            closeDrawer();
            await invalidateTestCases();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to save test case."));
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
                    setSubmitting(true);

                    try {
                        // Only the delete request itself determines success.
                        await deleteTestCase(id);
                        showToast.success("Test case deleted successfully.");

                        if (editingTestCase?.id === id) {
                            closeDrawer();
                        }

                        try {
                            await invalidateTestCases();
                        } catch (refreshError) {
                            // A refresh failure must not turn a
                            // successful delete into a failure toast.
                            console.error(
                                "Failed to refresh test cases after deletion:",
                                refreshError,
                            );
                        }
                    } catch (error) {
                        showToast.error(getErrorMessage(error, "Failed to delete test case."));
                    } finally {
                        setSubmitting(false);
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    if (!validQuestionId) {
        return null;
    }

    return (
        <div className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--cs-text-muted)]">
                    Input and expected output values used to evaluate coding submissions.
                </p>

                <Button type="button" onClick={openCreate} disabled={submitting}>
                    <Plus size={16} className="mr-1.5 inline" />
                    Add Test Case
                </Button>
            </div>

            <div
                className={
                    drawerOpen
                        ? "mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]"
                        : "mt-5"
                }
            >
                <div className="min-w-0">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <LoadingSpinner />
                        </div>
                    ) : isError ? (
                        <EmptyState
                            icon={<TestTube2 size={22} />}
                            title="Unable to load test cases"
                            description="Something went wrong while loading the test cases."
                        />
                    ) : sortedTestCases.length === 0 ? (
                        <EmptyState
                            icon={<TestTube2 size={22} />}
                            title="No test cases"
                            description="Add test cases to evaluate learner submissions."
                        />
                    ) : (
                        <TestCaseTable
                            testCases={sortedTestCases}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            disabled={submitting}
                        />
                    )}
                </div>

                {drawerOpen && (
                    <aside className="min-w-0 overflow-hidden rounded-xl border border-[var(--cs-border)]/70 bg-[var(--cs-surface)]/50 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-4 border-b border-[var(--cs-border)]/60 px-5 py-4">
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                                    {editingTestCase ? "Edit Test Case" : "Add Test Case"}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-[var(--cs-text-muted)]">
                                    Configure the input, expected output, and visibility.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDrawer}
                                disabled={submitting}
                                aria-label="Close test case form"
                                className="shrink-0 rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span aria-hidden="true" className="text-lg leading-none">×</span>
                            </button>
                        </div>

                        <div className="p-5">
                            <TestCaseForm
                                key={editingTestCase?.id ?? "new-test-case"}
                                testCase={editingTestCase ?? undefined}
                                position={editingTestCase?.position ?? nextPosition}
                                submitting={submitting}
                                onSubmit={handleSubmit}
                                onCancel={closeDrawer}
                            />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default TestCasesSection;
