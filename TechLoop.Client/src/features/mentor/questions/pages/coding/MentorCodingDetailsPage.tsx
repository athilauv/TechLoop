import {
    ArrowLeft,
    Edit3,
    FileQuestion,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../shared/Breadcrumb";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import { getMentorQuestionById, publishQuestion } from "../../../../../api/mentorQuestion.api.ts";
import type { MentorQuestion} from "../../../../../types/question.types.ts";
import DifficultyBadge from "../../components/DifficultyBadge";
import QuestionStatusBadge from "../../components/QuestionStatusBadge";
import CodingTemplatesSection from "../../components/coding/CodingTemplatesSection";
import TestCasesSection from "../../components/coding/TestCasesSection";

const MentorCodingDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const questionId = Number(id);

    const [question, setQuestion] =
        useState<MentorQuestion | null>(null);

    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);

    const loadQuestion = async () => {
        const result =
            await getMentorQuestionById(questionId);

        setQuestion(result);
    };

    useEffect(() => {
        if (
            !questionId ||
            Number.isNaN(questionId)
        ) {
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                await loadQuestion();
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [questionId]);

    const handlePublish = async () => {
        try {
            setPublishing(true);

            await publishQuestion(questionId);
            await loadQuestion();
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={<FileQuestion className="h-6 w-6" />}
                    title="Question not found"
                    description="The requested coding question could not be found."
                />
            </div>
        );
    }

    return (
        <div className="min-h-full px-6 py-6">
            <Breadcrumb
                items={[
                    {
                        label: "Questions",
                        onClick: () =>
                            navigate("/mentor/questions/coding"),
                    },
                    {
                        label: "Coding Questions",
                        onClick: () =>
                            navigate("/mentor/questions/coding"),
                    },
                    {
                        label: question.title,
                    },
                ]}
            />

            <div className="mx-auto mt-6 max-w-6xl">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/mentor/questions/coding",
                        )
                    }
                    className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--cs-text-muted)] hover:text-[var(--cs-text)]"
                >
                    <ArrowLeft size={17} />
                    Back to Coding Questions
                </button>

                {/* Question header */}

                <section className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--cs-text-secondary)]">
                                    Coding
                                </span>

                                <DifficultyBadge
                                    difficulty={
                                        question.difficulty
                                    }
                                />

                                <QuestionStatusBadge
                                    publishedAt={
                                        question.publishedAt
                                    }
                                />
                            </div>

                            <h1 className="text-2xl font-bold text-[var(--cs-text)]">
                                {question.title}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-[var(--cs-text-muted)]">
                                {question.description ||
                                    "No description available."}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {!question.publishedAt && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        void handlePublish()
                                    }
                                    disabled={publishing}
                                    className="rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {publishing
                                        ? "Publishing..."
                                        : "Publish"}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/mentor/questions/coding/${question.id}/edit`,
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text)] hover:bg-[var(--cs-surface-muted)]"
                            >
                                <Edit3 size={16} />
                                Edit
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-[var(--cs-border)] pt-5 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">
                                Marks
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--cs-text)]">
                                {question.mark}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">
                                Position
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--cs-text)]">
                                {question.position}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">
                                Time Limit
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--cs-text)]">
                                {question.timeLimitSeconds
                                    ? `${question.timeLimitSeconds}s`
                                    : "Not set"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--cs-text-muted)]">
                                Memory Limit
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[var(--cs-text)]">
                                {question.memoryLimitMb
                                    ? `${question.memoryLimitMb} MB`
                                    : "Not set"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Question content */}

                <section className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <h2 className="text-base font-semibold text-[var(--cs-text)]">
                        Question Details
                    </h2>

                    <div className="mt-5 space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-[var(--cs-text)]">
                                Hint
                            </h3>

                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                                {question.hint ||
                                    "No hint provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-[var(--cs-text)]">
                                Explanation
                            </h3>

                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                                {question.explanation ||
                                    "No explanation provided."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Coding templates */}

                <div className="mt-6">
                    <CodingTemplatesSection
                        questionId={question.id}
                    />
                </div>

                {/* Test cases */}

                <div className="mt-6">
                    <TestCasesSection
                        questionId={question.id}
                    />
                </div>

                {/* Discussion */}

                <section className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-[var(--cs-text)]">
                                Discussion
                            </h2>

                            <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                                View discussions related to this
                                coding question.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/mentor/questions/coding/${question.id}/discussions`,
                                )
                            }
                            className="rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text)] hover:bg-[var(--cs-surface-muted)]"
                        >
                            Open Discussion
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MentorCodingDetailsPage;