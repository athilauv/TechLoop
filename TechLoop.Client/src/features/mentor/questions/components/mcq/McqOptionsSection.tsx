import { CheckCircle2, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import Button from "../../../../../shared/Button.tsx";

import {
    createMcqOption,
    deleteMcqOption,
    getMcqOptionsByQuestion,
    updateMcqOption,
} from "../../../../../api/mentorQuestion.api.ts";

import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import type {
    CreateMcqOptionRequest,
    MentorMcqOption,
    UpdateMcqOptionRequest,
} from "../../../../../types/question.types.ts";

import Drawer from "../shared/Drawer";
import McqOptionTable from "./McqOptionTable";
import McqOptionForm from "./McqOptionForm";

interface McqOptionsSectionProps {
    questionId: number;
}

const MAX_OPTIONS = 4;

const McqOptionsSection = ({ questionId }: McqOptionsSectionProps) => {
    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<MentorMcqOption | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        data: options = [],
        isLoading,
        isError,
    } = useQuery<MentorMcqOption[]>({
        queryKey: ["mentor-mcq-options", questionId],
        queryFn: async () => {
            const result = await getMcqOptionsByQuestion(questionId);
            return [...result].sort((a, b) => a.position - b.position);
        },
    });

    const nextPosition =
        options.length > 0 ? Math.max(...options.map((option) => option.position)) + 1 : 1;

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingOption(null);
    };

    const openCreate = () => {
        setEditingOption(null);
        setDrawerOpen(true);
    };

    const openEdit = (option: MentorMcqOption) => {
        setEditingOption(option);
        setDrawerOpen(true);
    };

    const invalidateOptions = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["mentor-mcq-options", questionId],
        });
    };

    const handleSubmit = async (request: CreateMcqOptionRequest | UpdateMcqOptionRequest) => {
        setSubmitting(true);

        try {
            if (editingOption) {
                await updateMcqOption(editingOption.id, request);
                showToast.success("Answer option updated successfully.");
            } else {
                await createMcqOption(questionId, request);
                showToast.success("Answer option created successfully.");
            }

            closeDrawer();
            await invalidateOptions();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to save answer option."));
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (optionId: number) => {
        showToast.confirm(
            "Delete Answer Option",
            "Are you sure you want to delete this answer option? This action cannot be undone.",
            () => {
                void (async () => {
                    setSubmitting(true);

                    try {
                        await deleteMcqOption(optionId);
                        showToast.success("Answer option deleted successfully.");

                        if (editingOption?.id === optionId) {
                            closeDrawer();
                        }

                        await invalidateOptions();
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(error, "Failed to delete answer option."),
                        );
                    } finally {
                        setSubmitting(false);
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    return (
        <div className="py-6">
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-[var(--cs-text-muted)]">
                    {options.length}/{MAX_OPTIONS} options added
                </p>

                {options.length < MAX_OPTIONS && (
                    <Button type="button" onClick={openCreate} disabled={submitting}>
                        <Plus size={16} className="mr-1.5 inline" />
                        Add Option
                    </Button>
                )}
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <LoadingSpinner />
                    </div>
                ) : isError ? (
                    <EmptyState
                        icon={<CheckCircle2 className="h-6 w-6" />}
                        title="Unable to load answer options"
                        description="Something went wrong while loading the answer options."
                    />
                ) : options.length === 0 ? (
                    <EmptyState
                        icon={<CheckCircle2 className="h-6 w-6" />}
                        title="No answer options"
                        description="Add answer options for this MCQ question."
                    />
                ) : (
                    <McqOptionTable
                        options={options}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        disabled={submitting}
                    />
                )}
            </div>

            {options.length === MAX_OPTIONS && (
                <div className="mt-5 rounded-lg border border-[var(--cs-success-border)] bg-[var(--cs-success-subtle)] px-4 py-3 text-sm text-[var(--cs-success)]">
                    All {MAX_OPTIONS} MCQ options have been added.
                </div>
            )}

            <Drawer
                open={drawerOpen}
                onClose={closeDrawer}
                title={editingOption ? "Edit Option" : "Add Option"}
            >
                <McqOptionForm
                    key={editingOption?.id ?? "new-option"}
                    option={editingOption ?? undefined}
                    position={editingOption?.position ?? nextPosition}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    onCancel={closeDrawer}
                />
            </Drawer>
        </div>
    );
};

export default McqOptionsSection;
