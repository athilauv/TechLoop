import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import {
    createCodingTemplate,
    deleteCodingTemplate,
    getCodingTemplatesByQuestion,
    updateCodingTemplate,
} from "../../../../../api/mentorCoding.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import type {
    CreateCodingTemplateRequest,
    MentorCodingTemplate,
    UpdateCodingTemplateRequest,
} from "../../../../../types/question.types.ts";
import CodingTemplateForm from "./CodingTemplateForm";

interface CodingTemplatesSectionProps {
    questionId: number;
}

const CodingTemplatesSection = ({
                                    questionId,
                                }: CodingTemplatesSectionProps) => {
    const [templates, setTemplates] = useState<
        MentorCodingTemplate[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] =
        useState<MentorCodingTemplate | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const result =
                    await getCodingTemplatesByQuestion(
                        questionId,
                    );

                if (!cancelled) {
                    setTemplates(result);
                }
            } catch (error) {
                if (!cancelled) {
                    setTemplates([]);

                    showToast.error(
                        getErrorMessage(
                            error,
                            "Failed to load coding templates.",
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

    const loadTemplates = async () => {
        try {
            const result =
                await getCodingTemplatesByQuestion(questionId);

            setTemplates(result);
        } catch {
            setTemplates([]);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const fetchTemplates = async () => {
            try {
                const result =
                    await getCodingTemplatesByQuestion(questionId);

                if (!cancelled) {
                    setTemplates(result);
                }
            } catch {
                if (!cancelled) {
                    setTemplates([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchTemplates();

        return () => {
            cancelled = true;
        };
    }, [questionId]);

    const handleCreate = async (
        request: CreateCodingTemplateRequest,
    ) => {
        try {
            setSubmitting(true);

            await createCodingTemplate(
                questionId,
                request,
            );

            setFormOpen(false);
            setEditingTemplate(null);

            await loadTemplates();

            showToast.success(
                "Coding template created successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to create coding template.",
                ),
            );

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (
        request: UpdateCodingTemplateRequest,
    ) => {
        if (!editingTemplate) {
            return;
        }

        try {
            setSubmitting(true);

            await updateCodingTemplate(
                editingTemplate.id,
                request,
            );

            setFormOpen(false);
            setEditingTemplate(null);

            await loadTemplates();

            showToast.success(
                "Coding template updated successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to update coding template.",
                ),
            );

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        showToast.confirm(
            "Delete Coding Template",
            "Are you sure you want to delete this coding template? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteCodingTemplate(id);

                        await loadTemplates();

                        showToast.success(
                            "Coding template deleted successfully.",
                        );
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(
                                error,
                                "Failed to delete coding template.",
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
        setEditingTemplate(null);
        setFormOpen(true);
    };

    const openEdit = (
        template: MentorCodingTemplate,
    ) => {
        setEditingTemplate(template);
        setFormOpen(true);
    };

    return (
        <section className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-[var(--cs-text)]">
                        Coding Templates
                    </h2>

                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        Starter and solution code for supported
                        technologies.
                    </p>
                </div>

                {!formOpen && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-border)] px-3 py-2 text-sm font-medium text-[var(--cs-text)] transition hover:bg-[var(--cs-surface-muted)]"
                    >
                        <Plus size={16} />
                        Add Template
                    </button>
                )}
            </div>

            {formOpen && (
                <div className="mt-5">
                    <CodingTemplateForm
                        key={
                            editingTemplate?.id ??
                            "new"
                        }
                        template={
                            editingTemplate ??
                            undefined
                        }
                        submitting={submitting}
                        onSubmit={
                            editingTemplate
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={() => {
                            setFormOpen(false);
                            setEditingTemplate(null);
                        }}
                    />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingSpinner />
                </div>
            ) : templates.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon={
                            <span className="text-lg font-bold">
                                {"</>"}
                            </span>
                        }
                        title="No coding templates"
                        description="Add at least one coding template before publishing this question."
                    />
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="rounded-lg border border-[var(--cs-border)] p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--cs-text)]">
                                        Technology #
                                        {template.technologyId}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEdit(
                                                template,
                                            )
                                        }
                                        className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                                        aria-label="Edit coding template"
                                    >
                                        <Edit3 size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                template.id,
                                            )
                                        }
                                        className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)]"
                                        aria-label="Delete coding template"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                        Starter Code
                                    </p>

                                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--cs-surface-muted)] p-4 text-xs text-[var(--cs-text)]">
                                        <code>
                                            {
                                                template.starterCode
                                            }
                                        </code>
                                    </pre>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--cs-text-muted)]">
                                        Solution Code
                                    </p>

                                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--cs-surface-muted)] p-4 text-xs text-[var(--cs-text)]">
                                        <code>
                                            {template.solutionCode ||
                                                "No solution code provided."}
                                        </code>
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

export default CodingTemplatesSection;