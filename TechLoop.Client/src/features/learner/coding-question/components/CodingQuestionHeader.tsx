//import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import type { LearnerQuestion } from "../../../../types/question.types.ts";
import { type DifficultyLevel } from "../../../../types/enums/difficulty-level.ts";
import { useDifficultyLevels } from "../../../../hooks/useLookups.ts";

interface CodingQuestionHeaderProps {
    question: LearnerQuestion;
}

const CodingQuestionHeader = ({
                                  question,
                              }: CodingQuestionHeaderProps) => {
    // const navigate = useNavigate();

    const { data: difficultyLevels = [] } = useDifficultyLevels();

    const getDifficultyLabel = (difficulty: DifficultyLevel) =>
        difficultyLevels.find((item) => item.id === difficulty)?.name ?? String(difficulty);

    const difficultyLabel = getDifficultyLabel(question.difficulty);

    return (
        <div className="border-b border-[#223A59] pb-5">
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => navigate(-1)}*/}
            {/*    className="mb-4 inline-flex items-center gap-2 text-sm text-[#8CA3BF] transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40 rounded"*/}
            {/*>*/}
            {/*    <ArrowLeft size={16} />*/}
            {/*    Back to problems*/}
            {/*</button>*/}

            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-white">
                    {question.title}
                </h1>

                <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        difficultyLabel.toLowerCase() === "easy"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : difficultyLabel.toLowerCase() === "medium"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                >
                    {difficultyLabel}
                </span>

                <span className="text-sm text-[#5C7394]">
                    {question.mark} marks
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8CA3BF]">
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