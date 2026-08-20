import { CheckCircle2, Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
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
import McqOptionForm from "./McqOptionForm";

interface McqOptionsSectionProps {
    questionId: number;
}

const McqOptionsSection = ({
                               questionId,
                           }: McqOptionsSectionProps) => {
    const [options, setOptions] = useState<MentorMcqOption[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingOption, setEditingOption] =
        useState<MentorMcqOption | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const result =
                    await getMcqOptionsByQuestion(questionId);

                if (!cancelled) {
                    setOptions(
                        [...result].sort(
                            (a, b) =>
                                a.position - b.position,
                        ),
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setOptions([]);

                    showToast.error(
                        getErrorMessage(
                            error,
                            "Failed to load answer options.",
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

    const loadOptions = async () => {
        try {
            setLoading(true);

            const result =
                await getMcqOptionsByQuestion(questionId);

            setOptions(
                [...result].sort(
                    (a, b) =>
                        a.position - b.position,
                ),
            );
        } catch (error) {
            setOptions([]);

            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to load answer options.",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (
        request: CreateMcqOptionRequest,
    ) => {
        try {
            setSubmitting(true);

            await createMcqOption(
                questionId,
                request,
            );

            setFormOpen(false);
            setEditingOption(null);

            await loadOptions();

            showToast.success(
                "Answer option created successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to create answer option.",
                ),
            );

            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (
        request: UpdateMcqOptionRequest,
    ) => {
        if (!editingOption) {
            return;
        }

        try {
            setSubmitting(true);

            await updateMcqOption(
                editingOption.id,
                request,
            );

            setFormOpen(false);
            setEditingOption(null);

            await loadOptions();

            showToast.success(
                "Answer option updated successfully.",
            );
        } catch (error) {
            showToast.error(
                getErrorMessage(
                    error,
                    "Failed to update answer option.",
                ),
            );

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
                    try {
                        await deleteMcqOption(optionId);

                        await loadOptions();

                        showToast.success(
                            "Answer option deleted successfully.",
                        );
                    } catch (error) {
                        showToast.error(
                            getErrorMessage(
                                error,
                                "Failed to delete answer option.",
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
        setEditingOption(null);
        setFormOpen(true);
    };

    const openEdit = (
        option: MentorMcqOption,
    ) => {
        setEditingOption(option);
        setFormOpen(true);
    };

    const nextPosition =
        options.length > 0
            ? Math.max(
            ...options.map(
                (option) => option.position,
            ),
        ) + 1
            : 1;

    return (
        <section className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-[var(--cs-text)]">
                        Answer Options
                    </h2>

                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        {options.length}/4 options added
                    </p>
                </div>

                {options.length < 4 && !formOpen && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-border)] px-3 py-2 text-sm font-medium text-[var(--cs-text)] transition hover:bg-[var(--cs-surface-muted)]"
                    >
                        <Plus size={16} />
                        Add Option
                    </button>
                )}
            </div>

            {formOpen && (
                <div className="mt-5">
                    <McqOptionForm
                        key={
                            editingOption?.id ??
                            "new"
                        }
                        option={
                            editingOption ??
                            undefined
                        }
                        position={
                            editingOption?.position ??
                            nextPosition
                        }
                        submitting={submitting}
                        onSubmit={
                            editingOption
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={() => {
                            setFormOpen(false);
                            setEditingOption(null);
                        }}
                    />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingSpinner />
                </div>
            ) : options.length === 0 ? (
                <div className="py-8">
                    <EmptyState
                        icon={
                            <CheckCircle2 className="h-6 w-6" />
                        }
                        title="No answer options"
                        description="Add answer options for this MCQ question."
                    />
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {options.map((option, index) => (
                        <div
                            key={option.id}
                            className="flex items-center gap-3 rounded-lg border border-[var(--cs-border)] p-4"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cs-surface-muted)] text-sm font-semibold text-[var(--cs-text)]">
                                {String.fromCharCode(
                                    65 + index,
                                )}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-[var(--cs-text)]">
                                    {option.optionText}
                                </p>
                            </div>

                            {option.isCorrect && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--cs-success-border)] bg-[var(--cs-success-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--cs-success)]">
                                    <CheckCircle2
                                        size={13}
                                    />
                                    Correct
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    openEdit(option)
                                }
                                className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                                aria-label="Edit option"
                            >
                                <Edit3 size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(
                                        option.id,
                                    )
                                }
                                className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-[var(--cs-danger-subtle)] hover:text-[var(--cs-danger)]"
                                aria-label="Delete option"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {options.length === 4 && (
                <div className="mt-5 rounded-lg border border-[var(--cs-success-border)] bg-[var(--cs-success-subtle)] px-4 py-3 text-sm text-[var(--cs-success)]">
                    All 4 MCQ options have been added.
                </div>
            )}
        </section>
    );
};

export default McqOptionsSection;