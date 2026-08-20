import {
    FileQuestion,
    Plus,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    getMentorQuestions,
} from "../../../../../api/mentorQuestion.api.ts";

import Breadcrumb from "../../../../../shared/Breadcrumb";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";

import type {
    DifficultyLevel as DifficultyLevelValue,
} from "../../../../../types/enums/difficulty-level.ts";

import {
    QuestionType,
} from "../../../../../types/enums/question-type.ts";

import type {
    MentorQuestion,
} from "../../../../../types/question.types.ts";

import QuestionCard from "../../components/QuestionCard";
import QuestionFilters from "../../components/QuestionFilters";

const MentorMcqQuestionsPage = () => {
    const navigate = useNavigate();

    const [questions, setQuestions] =
        useState<MentorQuestion[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [difficulty, setDifficulty] =
        useState<DifficultyLevelValue | "all">(
            "all",
        );

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const result =
                    await getMentorQuestions();

                if (!cancelled) {
                    setQuestions(result);
                }
            } catch {
                if (!cancelled) {
                    setQuestions([]);
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
    }, []);

    const mcqQuestions = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return questions
            .filter(
                (question) =>
                    question.questionType ===
                    QuestionType.Mcq,
            )
            .filter((question) => {
                if (
                    difficulty !== "all" &&
                    question.difficulty !==
                    difficulty
                ) {
                    return false;
                }

                return true;
            })
            .filter((question) => {
                if (!normalizedSearch) {
                    return true;
                }

                return (
                    question.title
                        .toLowerCase()
                        .includes(
                            normalizedSearch,
                        ) ||
                    question.slug
                        .toLowerCase()
                        .includes(
                            normalizedSearch,
                        ) ||
                    question.description
                        .toLowerCase()
                        .includes(
                            normalizedSearch,
                        )
                );
            })
            .sort(
                (a, b) =>
                    a.position - b.position,
            );
    }, [
        questions,
        search,
        difficulty,
    ]);

    const clearFilters = () => {
        setSearch("");
        setDifficulty("all");
    };

    const handleOpenQuestion = (
        questionId: number,
    ) => {
        navigate(
            `/mentor/questions/mcq/${questionId}`,
        );
    };

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    {
                        label: "Questions",
                    },
                    {
                        label: "MCQ Questions",
                    },
                ]}
            />

            <div className="mx-auto mt-6 max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--cs-text)]">
                            MCQ Questions
                        </h1>

                        <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                            Create and manage
                            multiple-choice
                            questions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/mentor/questions/mcq/create",
                            )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <Plus size={17} />
                        Create MCQ
                    </button>
                </div>

                <div className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-4">
                    <QuestionFilters
                        search={search}
                        difficulty={difficulty}
                        onSearchChange={setSearch}
                        onDifficultyChange={
                            setDifficulty
                        }
                        onClear={clearFilters}
                    />
                </div>

                <div className="mt-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : mcqQuestions.length === 0 ? (
                        <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] py-12">
                            <EmptyState
                                icon={
                                    <FileQuestion
                                        size={24}
                                    />
                                }
                                title="No MCQ questions"
                                description={
                                    search ||
                                    difficulty !==
                                    "all"
                                        ? "No MCQ questions match the selected filters."
                                        : "Create your first MCQ question to get started."
                                }
                                action={
                                    search ||
                                    difficulty !==
                                    "all" ? (
                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text)] transition-colors hover:bg-[var(--cs-surface-muted)]"
                                        >
                                            Clear Filters
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/mentor/questions/mcq/create",
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                        >
                                            <Plus
                                                size={
                                                    16
                                                }
                                            />
                                            Create MCQ
                                        </button>
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {mcqQuestions.map(
                                (question) => (
                                    <div
                                        key={
                                            question.id
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            handleOpenQuestion(
                                                question.id,
                                            )
                                        }
                                        onKeyDown={(
                                            event,
                                        ) => {
                                            if (
                                                event.key ===
                                                "Enter" ||
                                                event.key ===
                                                " "
                                            ) {
                                                event.preventDefault();

                                                handleOpenQuestion(
                                                    question.id,
                                                );
                                            }
                                        }}
                                        className="cursor-pointer rounded-xl transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--cs-primary)]"
                                    >
                                        <QuestionCard
                                            question={question}
                                            basePath="/mentor/questions/mcq"
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorMcqQuestionsPage;