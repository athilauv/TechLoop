import { Clock3, Trophy } from "lucide-react";

import { DifficultyLevel } from "../../types/enums/difficulty-level";
import { QuestionType } from "../../types/enums/question-type";

interface QuestionCardProps {
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    mark: number;
    questionType: QuestionType;
}

const DIFFICULTY_STYLES: Record<string, string> = {
    Easy: "bg-[#00E8C2]/10 text-[#00E8C2]",
    Medium: "bg-amber-400/10 text-amber-300",
    Hard: "bg-rose-500/10 text-rose-300",
};

export default function QuestionCard({
                                         title,
                                         description,
                                         difficulty,
                                         mark,
                                         questionType,
                                     }: QuestionCardProps) {
    const difficultyLabel = DifficultyLevel[difficulty];
    const difficultyStyle =
        DIFFICULTY_STYLES[difficultyLabel] ?? "bg-[#8CA3BF]/10 text-[#8CA3BF]";

    return (
        <div className="rounded-2xl border border-[#223A59] bg-[#14243C] p-8">
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#00E8C2]/10 px-3 py-1 text-xs font-medium text-[#00E8C2]">
                    {QuestionType[questionType]}
                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyStyle}`}>
                    {difficultyLabel}
                </span>
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-white">{title}</h2>

            <p className="mt-4 leading-7 text-[#8CA3BF]">{description}</p>

            <div className="mt-8 flex items-center gap-6 border-t border-[#223A59] pt-6 text-sm text-[#8CA3BF]">
                <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#5C7394]" />
                    <span>Practice</span>
                </div>

                <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#5C7394]" />
                    <span>{mark} Marks</span>
                </div>
            </div>
        </div>
    );
}