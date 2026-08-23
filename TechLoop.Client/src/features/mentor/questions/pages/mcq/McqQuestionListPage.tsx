import { FileQuestion, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Breadcrumb from "../../../../../shared/Breadcrumb.tsx";
import Button from "../../../../../shared/Button.tsx";
import EmptyState from "../../../../../shared/EmptyState.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";

import { deleteQuestion, getMentorQuestions } from "../../../../../api/mentorQuestion.api.ts";
import { getErrorMessage } from "../../../../../utils/error.utils.ts";
import { showToast } from "../../../../../utils/toast.tsx";

import type { DifficultyLevel as DifficultyLevelType } from "../../../../../types/enums/difficulty-level.ts";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";

import QuestionFilters from "../../components/question-list/QuestionFilters.tsx";
import QuestionTable from "../../components/question-list/QuestionTable.tsx";

const McqQuestionListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState<DifficultyLevelType | "all">("all");

    const {
        data: questions = [],
        isLoading,
        isError,
    } = useQuery<MentorQuestion[]>({
        queryKey: ["mentor-questions"],
        queryFn: getMentorQuestions,
    });

    const mcqQuestions = useMemo(
        () => questions.filter((question) => question.questionType === QuestionType.Mcq),
        [questions],
    );

    const filteredQuestions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return mcqQuestions
            .filter((question) => {
                const matchesSearch =
                    !normalizedSearch ||
                    question.title.toLowerCase().includes(normalizedSearch) ||
                    question.slug.toLowerCase().includes(normalizedSearch) ||
                    question.description.toLowerCase().includes(normalizedSearch);

                const matchesDifficulty = difficulty === "all" || question.difficulty === difficulty;

                return matchesSearch && matchesDifficulty;
            })
            .sort((a, b) => a.position - b.position);
    }, [mcqQuestions, search, difficulty]);

    const clearFilters = () => {
        setSearch("");
        setDifficulty("all");
    };

    const handleEdit = (question: MentorQuestion) => {
        navigate(`/mentor/questions/mcq/${question.id}/edit`);
    };

    const handleDelete = (question: MentorQuestion) => {
        showToast.confirm(
            "Delete MCQ Question",
            "Are you sure you want to delete this MCQ question? This action cannot be undone.",
            () => {
                void (async () => {
                    try {
                        await deleteQuestion(question.id);
                        showToast.success("MCQ question deleted successfully.");
                        await queryClient.invalidateQueries({ queryKey: ["mentor-questions"] });
                    } catch (error) {
                        showToast.error(getErrorMessage(error, "Failed to delete MCQ question."));
                    }
                })();
            },
            undefined,
            "Delete",
        );
    };

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    { label: "Questions", onClick: () => navigate("/mentor/questions") },
                    { label: "MCQ Questions" },
                ]}
            />

            <div className="mx-auto mt-6 max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--cs-text)]">
                            MCQ Questions
                        </h1>
                        <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                            Create and manage multiple-choice questions.
                        </p>
                    </div>

                    <Button type="button" onClick={() => navigate("/mentor/questions/mcq/create")}>
                        <Plus size={16} className="mr-1.5 inline" />
                        Create MCQ
                    </Button>
                </div>

                <div className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-4">
                    <QuestionFilters
                        search={search}
                        difficulty={difficulty}
                        onSearchChange={setSearch}
                        onDifficultyChange={setDifficulty}
                        onClear={clearFilters}
                    />
                </div>

                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : isError ? (
                        <EmptyState
                            icon={<FileQuestion size={24} />}
                            title="Unable to load MCQ questions"
                            description="Something went wrong while loading MCQ questions."
                        />
                    ) : filteredQuestions.length === 0 ? (
                        <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] py-12">
                            <EmptyState
                                icon={<FileQuestion size={24} />}
                                title="No MCQ questions"
                                description={
                                    search || difficulty !== "all"
                                        ? "No MCQ questions match the selected filters."
                                        : "Create your first MCQ question to get started."
                                }
                                action={
                                    search || difficulty !== "all" ? (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text)] transition-colors hover:bg-[var(--cs-surface-muted)]"
                                        >
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={() => navigate("/mentor/questions/mcq/create")}
                                        >
                                            <Plus size={16} className="mr-1.5 inline" />
                                            Create MCQ
                                        </Button>
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <QuestionTable
                            questions={filteredQuestions}
                            basePath="/mentor/questions/mcq"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default McqQuestionListPage;
