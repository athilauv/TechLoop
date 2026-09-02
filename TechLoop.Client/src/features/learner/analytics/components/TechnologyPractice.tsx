import { CheckCircle2, XCircle } from "lucide-react";
import type { TechnologyPractice as TechnologyPracticeData } from "../../../../types/analytics.types";

interface TechnologyPracticeProps {
    technologies: TechnologyPracticeData[];
}

export default function TechnologyPractice({
    technologies,
}: TechnologyPracticeProps) {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                Technologies
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
                Practice by technology
            </h2>
            <p className="mt-1 text-xs text-[#617b9d]">
                A clear breakdown of your attempts and results for each technology.
            </p>

            {technologies.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No technology practice data yet.
                    </p>
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    {[...technologies]
                        .sort((a, b) => b.totalAttempts - a.totalAttempts)
                        .map((technology) => {
                            const successRate = technology.totalAttempts
                                ? Math.round(
                                    (technology.successfulAttempts /
                                        technology.totalAttempts) *
                                    100
                                )
                                : 0;

                            return (
                                <div
                                    key={technology.technologyId}
                                    className="rounded-xl border border-[#1e3254] bg-[#0b182b] p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {technology.technologyName}
                                            </p>
                                            <p className="mt-1 text-[10px] text-[#617b9d]">
                                                {technology.totalAttempts} total attempts
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-[#17D4C3]">
                                            {successRate}%
                                        </span>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#081423]">
                                        <div
                                            className="h-full rounded-full bg-[#17D4C3]"
                                            style={{ width: `${Math.max(successRate, 2)}%` }}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center gap-5 text-[10px] text-[#617b9d]">
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 size={12} className="text-[#17D4C3]" />
                                            Passed {technology.successfulAttempts}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <XCircle size={12} className="text-[#e05c5c]" />
                                            Failed {technology.failedAttempts}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </section>
    );
}
