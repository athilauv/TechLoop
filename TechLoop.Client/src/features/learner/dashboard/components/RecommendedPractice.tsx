import { ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecommendedPractice} from "../../../../hooks/useRecommendedPractice.ts";
import { DifficultyLevel } from "../../../../types/enums/difficulty-level.ts";

const DIFFICULTY_LABEL: Record<number, string> = {
    [DifficultyLevel.Beginner]: "Beginner",
    [DifficultyLevel.Easy]: "Easy",
    [DifficultyLevel.Medium]: "Medium",
    [DifficultyLevel.Hard]: "Hard",
    [DifficultyLevel.Expert]: "Expert",
};

const DIFFICULTY_COLOR: Record<number, string> = {
    [DifficultyLevel.Beginner]: "text-[#65c7a7] bg-[#65c7a7]/10",
    [DifficultyLevel.Easy]: "text-[#65c7a7] bg-[#65c7a7]/10",
    [DifficultyLevel.Medium]: "text-[#e0c87a] bg-[#e0c87a]/10",
    [DifficultyLevel.Hard]: "text-[#e0a17a] bg-[#e0a17a]/10",
    [DifficultyLevel.Expert]: "text-[#e07a7a] bg-[#e07a7a]/10",
};

export default function RecommendedPractice() {
    const { questions, isLoading } = useRecommendedPractice();

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Target size={18} className="text-[#17D4C3]" />

                    <div>
                        <h2 className="text-sm font-semibold text-[#e8f0fe]">
                            Practice
                        </h2>

                        <p className="mt-1 text-xs text-[#5f7898]">
                            A mix of difficulties to keep you sharp
                        </p>
                    </div>
                </div>

                <Link
                    to="/learner/coding-questions"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#17D4C3] hover:underline"
                >
                    View all
                    <ArrowRight size={13} />
                </Link>
            </div>

            {isLoading ? (
                <div className="mt-5 space-y-2">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-14 animate-pulse rounded-xl border border-[#1e3254] bg-[#0c1a2e]"
                        />
                    ))}
                </div>
            ) : questions.length === 0 ? (
                <div className="mt-5 rounded-xl border border-[#1e3254] bg-[#0c1a2e] px-5 py-8 text-center">
                    <p className="text-sm text-[#7a99bb]">
                        No coding questions published yet.
                    </p>
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    {questions.map((question) => (
                        <Link
                            key={question.id}
                            to={`/learner/coding-questions/${question.id}`}
                            className="group flex items-center justify-between rounded-xl border border-[#1e3254] px-4 py-3 no-underline transition-colors hover:border-[#29466d] hover:bg-[#12243b]"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#dce8f8]">
                                    {question.title}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-xs text-[#5f7898]">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                            DIFFICULTY_COLOR[
                                                question.difficulty
                                                ] ??
                                            "bg-[#17D4C3]/10 text-[#17D4C3]"
                                        }`}
                                    >
                                        {DIFFICULTY_LABEL[
                                            question.difficulty
                                            ] ?? "Unknown"}
                                    </span>

                                    <span>{question.mark} marks</span>
                                </div>
                            </div>

                            <ArrowRight
                                size={15}
                                className="ml-3 flex-shrink-0 text-[#496582] transition-transform group-hover:translate-x-1 group-hover:text-[#17D4C3]"
                            />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
