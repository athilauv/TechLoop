import { useMemo } from "react";

import type { DailyActivity } from "../../../types/analytics.types";

interface DailyActivityTimelineProps {
    data: DailyActivity[];
}

function formatMinutes(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    return remaining === 0
        ? `${hours}h`
        : `${hours}h ${remaining}m`;
}

function formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
        }
    );
}

export default function DailyActivityTimeline({
                                                  data,
                                              }: DailyActivityTimelineProps) {
    const sortedData = useMemo(
        () =>
            [...data].sort(
                (a, b) =>
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
            ),
        [data]
    );

    const totals = useMemo(() => {
        return sortedData.reduce(
            (acc, item) => ({
                learning:
                    acc.learning + item.learningMinutes,
                coding:
                    acc.coding + item.codingMinutes,
                mcq:
                    acc.mcq + item.mcqMinutes,
                total:
                    acc.total + item.timeSpentMinutes,
            }),
            {
                learning: 0,
                coding: 0,
                mcq: 0,
                total: 0,
            }
        );
    }, [sortedData]);

    const maxMinutes = Math.max(
        ...sortedData.map((item) => item.timeSpentMinutes),
        1
    );

    if (sortedData.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-6">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Daily Activity
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                    Learning time
                </h2>

                <div className="mt-6 rounded-xl border border-dashed border-[#1e3254] p-10 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No daily activity data yet.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                            Daily Activity
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-white">
                            Learning time
                        </h2>

                        <p className="mt-1 text-xs text-[#617b9d]">
                            How your learning time is distributed across each day.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                            <p className="text-sm font-bold text-[#17D4C3]">
                                {formatMinutes(totals.total)}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-[#617b9d]">
                                Total
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-white">
                                {formatMinutes(totals.learning)}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-[#617b9d]">
                                Learning
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-white">
                                {formatMinutes(totals.coding)}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-[#617b9d]">
                                Coding
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-white">
                                {formatMinutes(totals.mcq)}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-[#617b9d]">
                                MCQ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[680px]">
                        <div className="flex items-end gap-3">
                            {sortedData.map((day) => {
                                const height = Math.max(
                                    8,
                                    (day.timeSpentMinutes /
                                        maxMinutes) *
                                    190
                                );

                                const learningWidth =
                                    day.timeSpentMinutes > 0
                                        ? (day.learningMinutes /
                                            day.timeSpentMinutes) *
                                        100
                                        : 0;

                                const codingWidth =
                                    day.timeSpentMinutes > 0
                                        ? (day.codingMinutes /
                                            day.timeSpentMinutes) *
                                        100
                                        : 0;

                                const mcqWidth =
                                    day.timeSpentMinutes > 0
                                        ? (day.mcqMinutes /
                                            day.timeSpentMinutes) *
                                        100
                                        : 0;

                                return (
                                    <div
                                        key={day.date}
                                        className="flex min-w-[44px] flex-1 flex-col items-center"
                                    >
                                        <div
                                            className="group relative flex w-9 items-end overflow-hidden rounded-lg bg-[#0a1729]"
                                            style={{
                                                height: `${height}px`,
                                            }}
                                        >
                                            <div
                                                className="absolute bottom-0 left-0 w-full bg-[#17D4C3]/80"
                                                style={{
                                                    height: `${learningWidth}%`,
                                                }}
                                            />

                                            <div
                                                className="absolute left-0 w-full bg-[#4e9cff]/70"
                                                style={{
                                                    bottom: `${learningWidth}%`,
                                                    height: `${codingWidth}%`,
                                                }}
                                            />

                                            <div
                                                className="absolute left-0 w-full bg-[#c59bff]/70"
                                                style={{
                                                    bottom: `${
                                                        learningWidth +
                                                        codingWidth
                                                    }%`,
                                                    height: `${mcqWidth}%`,
                                                }}
                                            />

                                            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-40 -translate-x-1/2 rounded-lg border border-[#29466d] bg-[#081423] p-3 shadow-xl group-hover:block">
                                                <p className="text-xs font-semibold text-white">
                                                    {formatDate(day.date)}
                                                </p>

                                                <p className="mt-1 text-xs text-[#17D4C3]">
                                                    {formatMinutes(
                                                        day.timeSpentMinutes
                                                    )}
                                                </p>

                                                <div className="mt-2 space-y-1 text-[10px] text-[#617b9d]">
                                                    <p>
                                                        Learning:{" "}
                                                        {formatMinutes(
                                                            day.learningMinutes
                                                        )}
                                                    </p>

                                                    <p>
                                                        Coding:{" "}
                                                        {formatMinutes(
                                                            day.codingMinutes
                                                        )}
                                                    </p>

                                                    <p>
                                                        MCQ:{" "}
                                                        {formatMinutes(
                                                            day.mcqMinutes
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="mt-3 text-[9px] text-[#526d8e]">
                                            {formatDate(day.date)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#7189a8]">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#17D4C3]" />
                        Learning
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#4e9cff]" />
                        Coding
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#c59bff]" />
                        MCQ
                    </div>
                </div>
            </div>
        </section>
    );
}