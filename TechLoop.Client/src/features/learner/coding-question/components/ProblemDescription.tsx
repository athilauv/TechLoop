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
                <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
                    Problem
                </h2>

                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {question.description}
                </div>
            </section>

            {/* Hint */}
            {question.hint && (
                <section>
                    <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
                        Hint
                    </h2>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                        {question.hint}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProblemDescription;