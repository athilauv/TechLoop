import { BarChart3, CheckCircle2, Target, Trophy } from "lucide-react";
import type { TechnologyPractice } from "../../../../types/analytics.types";

interface PracticeOverviewProps {
    technologies: TechnologyPractice[];
}

export default function PracticeOverview({
    technologies,
}: PracticeOverviewProps) {
    if (technologies.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Practice Overview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                    Where you practice
                </h2>
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <BarChart3 className="mx-auto mb-3 text-[#526d8e]" size={28} />
                    <p className="text-sm text-[#7189a8]">
                        No technology practice data yet.
                    </p>
                </div>
            </section>
        );
    }

    const totalAttempts = technologies.reduce(
        (sum, item) => sum + item.totalAttempts,
        0
    );
    const totalSuccessful = technologies.reduce(
        (sum, item) => sum + item.successfulAttempts,
        0
    );
    const bestTechnology = [...technologies].sort(
        (a, b) => b.totalAttempts - a.totalAttempts
    )[0];
    const overallRate = totalAttempts
        ? Math.round((totalSuccessful / totalAttempts) * 100)
        : 0;

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#17D4C3]">
                        <BarChart3 size={15} />
                        <p className="text-xs font-semibold uppercase tracking-[1px]">
                            Practice Overview
                        </p>
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Where you practice
                    </h2>
                    <p className="mt-1 text-xs text-[#617b9d]">
                        See which technologies you practice most and how often your attempts succeed.
                    </p>
                </div>

                <div className="rounded-lg border border-[#1e3254] bg-[#0b182b] px-4 py-2 text-right">
                    <p className="text-lg font-bold text-white">{technologies.length}</p>
                    <p className="text-[9px] uppercase tracking-wide text-[#617b9d]">Technologies</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#0b182b] p-4">
                    <div className="flex items-center gap-2 text-[#17D4C3]">
                        <Target size={15} />
                        <span className="text-[10px] uppercase tracking-wide text-[#617b9d]">Total attempts</span>
                    </div>
                    <p className="mt-2 text-xl font-bold text-white">{totalAttempts}</p>
                </div>

                <div className="rounded-xl bg-[#0b182b] p-4">
                    <div className="flex items-center gap-2 text-[#17D4C3]">
                        <CheckCircle2 size={15} />
                        <span className="text-[10px] uppercase tracking-wide text-[#617b9d]">Success rate</span>
                    </div>
                    <p className="mt-2 text-xl font-bold text-[#17D4C3]">{overallRate}%</p>
                </div>

                <div className="rounded-xl bg-[#0b182b] p-4">
                    <div className="flex items-center gap-2 text-[#17D4C3]">
                        <Trophy size={15} />
                        <span className="text-[10px] uppercase tracking-wide text-[#617b9d]">Most practiced</span>
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-white">
                        {bestTechnology.technologyName}
                    </p>
                </div>
            </div>

            <div className="mt-5 space-y-3">
                {[...technologies]
                    .sort((a, b) => b.totalAttempts - a.totalAttempts)
                    .slice(0, 6)
                    .map((technology) => {
                        const rate = technology.totalAttempts
                            ? Math.round(
                                (technology.successfulAttempts /
                                    technology.totalAttempts) *
                                100
                            )
                            : 0;
                        const share = totalAttempts
                            ? Math.round(
                                (technology.totalAttempts / totalAttempts) *
                                100
                            )
                            : 0;

                        return (
                            <div
                                key={technology.technologyId}
                                className="rounded-xl border border-[#1e3254] bg-[#0b182b] p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {technology.technologyName}
                                        </p>
                                        <p className="mt-1 text-[10px] text-[#617b9d]">
                                            {technology.totalAttempts} attempts · {share}% of your practice
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm font-bold text-[#17D4C3]">
                                        {rate}%
                                    </span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#081423]">
                                    <div
                                        className="h-full rounded-full bg-[#17D4C3] transition-all"
                                        style={{ width: `${Math.max(rate, 2)}%` }}
                                    />
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[10px] text-[#617b9d]">
                                    <span>Passed {technology.successfulAttempts}</span>
                                    <span>Failed {technology.failedAttempts}</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
