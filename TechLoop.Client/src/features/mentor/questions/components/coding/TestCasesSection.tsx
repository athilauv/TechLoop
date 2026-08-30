import {MessageSquarePlus, TestTube2} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import Button from "../../../../../shared/Button.tsx";
import {createTestCase, deleteTestCase, getTestCasesByQuestion, updateTestCase } from "../../../../../api/mentorCoding.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type { CreateTestCaseRequest, MentorTestCase, UpdateTestCaseRequest } from "../../../../../types/question.types.ts";
import TestCaseTable from "./TestCaseTable";
import TestCaseForm from "./TestCaseForm";
import Drawer from "../shared/Drawer";

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
    const nextPosition = sortedTestCases.length > 0 ? Math.max(...sortedTestCases.map((testCase) => testCase.position)) + 1 : 1;
    const closeDrawer = () => {setDrawerOpen(false);setEditingTestCase(null);};
    const openCreate = () => {setEditingTestCase(null);setDrawerOpen(true);};
    const openEdit = (testCase: MentorTestCase) => {
        setEditingTestCase(testCase);
        setDrawerOpen(true);
    };

    const invalidateTestCases = async () => {
        await queryClient.invalidateQueries({queryKey: ["mentor-test-cases", questionId],});
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
                        await deleteTestCase(id);
                        showToast.success("Test case deleted successfully.");

                        if (editingTestCase?.id === id) {
                            closeDrawer();
                        }

                        try {
                            await invalidateTestCases();
                        } catch (refreshError) {
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
            <div className="flex justify-end">
                <Button type="button" onClick={openCreate} disabled={submitting}className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--cs-primary-contrast)] transition-colors duration-150 hover:bg-[var(--cs-primary-hover,var(--cs-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40">
                    <MessageSquarePlus size={16} />
                    Add Test Case
                </Button>
            </div>

            <div className="mt-5 min-w-0">
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

            <Drawer
                open={drawerOpen}
                onClose={closeDrawer}
                title={editingTestCase ? "Edit Test Case" : "Add Test Case"}
            >
                <TestCaseForm
                    key={editingTestCase?.id ?? "new-test-case"}
                    testCase={editingTestCase ?? undefined}
                    position={editingTestCase?.position ?? nextPosition}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    onCancel={closeDrawer}
                />
            </Drawer>
        </div>
    );
};

export default TestCasesSection;
