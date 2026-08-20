import { ArrowLeft, Edit3, FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../shared/Breadcrumb";
import EmptyState from "../../../../../shared/EmptyState";
import LoadingSpinner from "../../../../../shared/LoadingSpinner";
import { getMentorQuestionById, publishQuestion } from "../../../../../api/mentorQuestion.api.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";
import DifficultyBadge from "../../components/DifficultyBadge";
import QuestionStatusBadge from "../../components/QuestionStatusBadge";
import McqOptionsSection from "../../components/mcq/McqOptionsSection";

const MentorMcqDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const questionId = Number(id);

    const isValidQuestionId =
        Number.isInteger(questionId) &&
        questionId > 0;

    const [question, setQuestion] =
        useState<MentorQuestion | null>(null);

    const [loading, setLoading] =
        useState(isValidQuestionId);

    const [publishing, setPublishing] =
        useState(false);

    useEffect(() => {
        if (!isValidQuestionId) {
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const result =
                    await getMentorQuestionById(
                        questionId,
                    );

                if (!cancelled) {
                    setQuestion(result);
                }
            } catch {
                if (!cancelled) {
                    setQuestion(null);
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
    }, [isValidQuestionId, questionId]);

    const handlePublish = async () => {
        if (!isValidQuestionId) {
            return;
        }

        try {
            setPublishing(true);

            await publishQuestion(questionId);

            const result =
                await getMentorQuestionById(
                    questionId,
                );

            setQuestion(result);
        } finally {
            setPublishing(false);
        }
    };

    if (!isValidQuestionId) {
        return (
            <div className="px-6 py-6">
                <EmptyState
                    icon={
                        <FileQuestion size={24} />
                    }
                    title="Question not found"
                    description="The requested question could not be found."
                />
            </div>
        );
    }

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
                    icon={
                        <FileQuestion size={24} />
                    }
                    title="Question not found"
                    description="The requested question could not be found."
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
                            navigate(
                                "/mentor/questions/mcq",
                            ),
                    },
                    {
                        label: "MCQ Questions",
                        onClick: () =>
                            navigate(
                                "/mentor/questions/mcq",
                            ),
                    },
                    {
                        label: question.title,
                    },
                ]}
            />

            <div className="mx-auto mt-6 max-w-5xl">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/mentor/questions/mcq",
                        )
                    }
                    className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--cs-text-muted)] transition-colors hover:text-[var(--cs-text)]"
                >
                    <ArrowLeft size={17} />
                    Back to MCQ Questions
                </button>

                <section className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
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

                            <p className="mt-2 text-sm text-[var(--cs-text-muted)]">
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
                                    disabled={
                                        publishing
                                    }
                                    className="rounded-lg bg-[var(--cs-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        `/mentor/questions/mcq/${question.id}/edit`,
                                    )
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text)] transition-colors hover:bg-[var(--cs-surface-muted)]"
                            >
                                <Edit3 size={16} />
                                Edit
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-[var(--cs-border)] pt-5 sm:grid-cols-3">
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
                                Slug
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-[var(--cs-text)]">
                                {question.slug}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-6 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6">
                    <h2 className="text-base font-semibold text-[var(--cs-text)]">
                        Question Details
                    </h2>

                    <div className="mt-5 space-y-5">
                        <div>
                            <h3 className="text-sm font-medium text-[var(--cs-text)]">
                                Hint
                            </h3>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--cs-text-secondary)]">
                                {question.hint ||
                                    "No hint provided."}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-[var(--cs-text)]">
                                Explanation
                            </h3>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--cs-text-secondary)]">
                                {question.explanation ||
                                    "No explanation provided."}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-6">
                    <McqOptionsSection
                        questionId={question.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default MentorMcqDetailsPage;