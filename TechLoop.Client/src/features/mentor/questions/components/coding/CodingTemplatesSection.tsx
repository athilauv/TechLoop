import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import Button from "../../../../../shared/Button.tsx";

import {
    createCodingTemplate,
    deleteCodingTemplate,
    getCodingTemplatesByQuestion,
    updateCodingTemplate,
} from "../../../../../api/mentorCoding.api.ts";

import { getMentorCurriculum } from "../../../../../api/mentor.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import type {
    CreateCodingTemplateRequest,
    MentorCodingTemplate,
    UpdateCodingTemplateRequest,
} from "../../../../../types/question.types.ts";

import TemplateTable from "./TemplateTable";
import CodingTemplateForm from "./CodingTemplateForm";

interface CodingTemplatesSectionProps {
    questionId: number;
}

const CodingTemplatesSection = ({ questionId }: CodingTemplatesSectionProps) => {
    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<MentorCodingTemplate | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const validQuestionId = Number.isInteger(questionId) && questionId > 0;

    const {
        data: templates = [],
        isLoading: templatesLoading,
        isError: templatesError,
    } = useQuery<MentorCodingTemplate[]>({
        queryKey: ["mentor-coding-templates", questionId],
        queryFn: () => getCodingTemplatesByQuestion(questionId),
        enabled: validQuestionId,
    });

    const {
        data: curriculum,
        isLoading: curriculumLoading,
        isError: curriculumError,
    } = useQuery({
        queryKey: ["mentor-curriculum"],
        queryFn: getMentorCurriculum,
    });

    const technologyId = curriculum?.technologyId ?? 0;
    const technologyName = curriculum?.technologyName ?? "";

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingTemplate(null);
    };

    const openCreate = () => {
        if (submitting) return;

        if (technologyId <= 0) {
            showToast.error("Your technology could not be determined.");
            return;
        }

        setEditingTemplate(null);
        setDrawerOpen(true);
    };

    const openEdit = (template: MentorCodingTemplate) => {
        if (submitting) return;

        setEditingTemplate(template);
        setDrawerOpen(true);
    };

    const invalidateTemplates = async () => {
        try {
            await queryClient.invalidateQueries({
                queryKey: ["mentor-coding-templates", questionId],
            });
        } catch (error) {
            console.error("Failed to refresh coding templates:", error);
        }
    };

    const handleSubmit = async (
        request: CreateCodingTemplateRequest | UpdateCodingTemplateRequest,
    ) => {
        if (submitting) return;

        if (technologyId <= 0) {
            showToast.error("Technology could not be determined.");
            return;
        }

        const requestWithTechnology = { ...request, technologyId };

        setSubmitting(true);

        try {
            if (editingTemplate) {
                await updateCodingTemplate(editingTemplate.id, requestWithTechnology);
                showToast.success("Coding template updated successfully.");
            } else {
                await createCodingTemplate(questionId, requestWithTechnology);
                showToast.success("Coding template created successfully.");
            }

            closeDrawer();
            await invalidateTemplates();
        } catch (error) {
            showToast.error(getErrorMessage(error, "Failed to save coding template."));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (template: MentorCodingTemplate) => {
        showToast.confirm(
            "Delete Coding Template",
            "Are you sure you want to delete this coding template? This action cannot be undone.",
            () => {
                void (async () => {
                    setSubmitting(true);

                    try {
                        await deleteCodingTemplate(template.id);
                        showToast.success("Coding template deleted successfully.");

                        if (editingTemplate?.id === template.id) {
                            closeDrawer();
                        }

                        await invalidateTemplates();
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(error, "Failed to delete coding template."),
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

    if (!validQuestionId) {
        return null;
    }

    if (templatesLoading || curriculumLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (templatesError || curriculumError) {
        return (
            <EmptyState
                icon={<span className="font-mono text-lg">{"</>"}</span>}
                title="Unable to load coding templates"
                description="Something went wrong while loading the coding template data."
            />
        );
    }

    if (technologyId <= 0 || !technologyName) {
        return (
            <EmptyState
                icon={<span className="font-mono text-lg">{"</>"}</span>}
                title="Technology unavailable"
                description="Your mentor technology could not be determined. Please check your mentor curriculum."
            />
        );
    }

    return (
        <div className="py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--cs-text-muted)]">
                    Starter and solution code for{" "}
                    <span className="font-medium text-[var(--cs-text-secondary)]">
                        {technologyName}
                    </span>
                    .
                </p>

                <Button type="button" onClick={openCreate} disabled={submitting}>
                    <Plus size={16} className="mr-1.5 inline" />
                    Add Template
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
                    {templates.length === 0 ? (
                        <EmptyState
                            icon={<span className="font-mono text-lg">{"</>"}</span>}
                            title="No coding templates"
                            description={`Add a coding template for ${technologyName}.`}
                        />
                    ) : (
                        <TemplateTable
                            templates={templates}
                            technologyName={technologyName}
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
                                    {editingTemplate ? "Edit Coding Template" : "Add Coding Template"}
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-[var(--cs-text-muted)]">
                                    Configure the starter and solution code for this coding question.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDrawer}
                                disabled={submitting}
                                aria-label="Close coding template form"
                                className="shrink-0 rounded-lg p-2 text-[var(--cs-text-muted)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 hover:text-[var(--cs-text)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span aria-hidden="true" className="text-lg leading-none">×</span>
                            </button>
                        </div>

                        <div className="p-5">
                            <CodingTemplateForm
                                key={editingTemplate?.id ?? "new-template"}
                                template={editingTemplate ?? undefined}
                                technologyId={technologyId}
                                technologyName={technologyName}
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

export default CodingTemplatesSection;
