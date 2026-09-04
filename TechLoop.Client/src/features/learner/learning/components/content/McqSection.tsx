import { ListChecks, Trophy } from "lucide-react";
import { useState } from "react";
import { useMcqQuestion, useSubmitMcqAnswer } from "../../../../../hooks/useMcqQuestion.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import McqOptions from "../question/McqOptions";

interface McqSectionProps {
    subTopicId: number;
    technologyId: number;
}

function McqQuestionCard({ question, technologyId,}: {
    question: NonNullable<ReturnType<typeof useMcqQuestion>["data"]>[number];
    technologyId: number;
}) {
    const submitMutation = useSubmitMcqAnswer();
    const [solved, setSolved] = useState(false);

    const handleSubmit = async (selectedOptionId: number) => {
        try {
            const result = await submitMutation.mutateAsync({
                questionId: question.id,
                technologyId,
                selectedOptionId,
            });

            if (result.isCorrect) {
                setSolved(true);
                showToast.success(`Correct Answer — You earned ${result.score} ${result.score === 1 ? "mark" : "marks"}.`);
            } else {
                submitMutation.reset();
                showToast.error("Wrong Answer");
            }
        } catch {
            submitMutation.reset();
        }
    };

    return (
        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-6">
            <div className="mb-6 flex items-start justify-between gap-5">
                <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-7 text-white">
                        {question.title}
                    </h3>

                    {question.description && (
                        <p className="mt-2 text-sm leading-6 text-[#8CA3BF]">
                            {question.description}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#00E8C2]/10 px-3 py-1 text-xs font-medium text-[#00E8C2]">
                    <Trophy className="h-3.5 w-3.5" />
                    {question.mark}{" "}
                    {question.mark === 1 ? "Mark" : "Marks"}
                </div>
            </div>

            <McqOptions
                options={question.options}
                disabled={submitMutation.isPending}
                solved={solved}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default function McqSection({
                                       subTopicId,
                                       technologyId,
                                   }: McqSectionProps) {
    const {
        data: questions,
        isLoading,
        isError,
    } = useMcqQuestion(subTopicId);

    if (isLoading) {
        return (
            <section className="mt-14 border-t border-[#223A59] pt-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 w-48 rounded bg-[#12233B]" />
                    <div className="h-4 w-72 rounded bg-[#12233B]" />
                    <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-6">
                        <div className="h-5 w-2/3 rounded bg-[#12233B]" />
                        <div className="mt-6 space-y-3">
                            <div className="h-14 rounded-xl bg-[#12233B]" />
                            <div className="h-14 rounded-xl bg-[#12233B]" />
                            <div className="h-14 rounded-xl bg-[#12233B]" />
                            <div className="h-14 rounded-xl bg-[#12233B]" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !questions?.length) {
        return null;
    }

    return (
        <section className="mt-14 border-t border-[#223A59] pt-10">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00E8C2]/25 bg-[#00E8C2]/10">
                        <ListChecks className="h-4 w-4 text-[#00E8C2]" />
                    </span>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#00E8C2]">
                            Quick Check
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-white">
                            Test your understanding
                        </h2>
                    </div>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8CA3BF]">
                    Answer these optional questions to practice what you have just learned.
                </p>
            </div>

            <div className="space-y-6">
                {questions
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((question) => (
                        <McqQuestionCard key={question.id}
                            question={question}
                            technologyId={technologyId}
                        />
                    ))}
            </div>
        </section>
    );
}
