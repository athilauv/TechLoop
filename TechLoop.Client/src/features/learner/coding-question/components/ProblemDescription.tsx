import type { LearnerQuestion } from "../../../../types/question.types.ts";

interface ProblemDescriptionProps {
    question: LearnerQuestion;
}

const ProblemDescription = ({
                                question,
                            }: ProblemDescriptionProps) => {
    return (
        <div className="space-y-6">
            {/* Description */}
            <section>
                <h2 className="mb-3 text-base font-semibold text-white">
                    Problem
                </h2>

                <div className="whitespace-pre-wrap text-sm leading-7 text-[#B9C8DC]">
                    {question.description}
                </div>
            </section>

            {/* Hint */}
            {question.hint && (
                <section>
                    <h2 className="mb-3 text-base font-semibold text-white">
                        Hint
                    </h2>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200/90">
                        {question.hint}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProblemDescription;