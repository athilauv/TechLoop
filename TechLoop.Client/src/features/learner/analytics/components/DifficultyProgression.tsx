import type {
    DifficultyProgression as DifficultyProgressionData,
} from "../../../../types/analytics.types";

interface DifficultyProgressionProps {
    difficulties: DifficultyProgressionData[];
}

export default function DifficultyProgression({
                                                  difficulties,
                                              }: DifficultyProgressionProps) {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                Difficulty
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
                Progression
            </h2>

            <p className="mt-1 text-xs text-[#617b9d]">
                Your practice across difficulty levels.
            </p>

            {difficulties.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No difficulty data yet.
                    </p>
                </div>
            ) : (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {difficulties.map((item, index) => (
                        <div
                            key={item.difficulty}
                            className="flex items-center gap-3"
                        >
                            <div className="min-w-[130px] rounded-xl border border-[#1e3254] bg-[#0b182b] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#17D4C3]">
                                    {item.difficultyName}
                                </p>

                                <p className="mt-2 text-xl font-bold text-white">
                                    {item.totalAttempts}
                                </p>

                                <p className="text-[10px] text-[#617b9d]">
                                    attempts
                                </p>

                                <div className="mt-3 flex justify-between text-[10px]">
                                    <span className="text-[#17D4C3]">
                                        {item.successfulAttempts} passed
                                    </span>

                                    <span className="text-[#e05c5c]">
                                        {item.failedAttempts} failed
                                    </span>
                                </div>
                            </div>

                            {index < difficulties.length - 1 && (
                                <span className="hidden text-[#29466d] sm:block">
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}