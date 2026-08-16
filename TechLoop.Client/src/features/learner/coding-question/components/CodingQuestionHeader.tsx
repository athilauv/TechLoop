import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LearnerQuestion } from "../../../../types/question.types.ts";
import { DifficultyLevel } from "../../../../types/enums/difficulty-level.ts";

interface CodingQuestionHeaderProps {
    question: LearnerQuestion;
}

const CodingQuestionHeader = ({
                                  question,
                              }: CodingQuestionHeaderProps) => {
    const navigate = useNavigate();

    const getDifficultyLabel = (difficulty: DifficultyLevel) => {
        const label = DifficultyLevel[difficulty];
        return typeof label === "string" ? label : String(difficulty);
    };

    const difficultyLabel = getDifficultyLabel(question.difficulty);

    return (
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
            <button type="button" onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <ArrowLeft size={16} />
                Back to problems
            </button>

            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {question.title}
                </h1>

                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        difficultyLabel.toLowerCase() === "easy"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : difficultyLabel.toLowerCase() === "medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                >
                    {difficultyLabel}
                </span>

                <span className="text-sm text-slate-400">
                    {question.mark} marks
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                {question.timeLimitSeconds !== null && (
                    <span>
                        Time limit: {question.timeLimitSeconds}s
                    </span>
                )}

                {question.memoryLimitMb !== null && (
                    <span>
                        Memory limit: {question.memoryLimitMb} MB
                    </span>
                )}
            </div>
        </div>
    );
};

export default CodingQuestionHeader;