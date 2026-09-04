import { useMemo } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { DailyActivity } from "../../../../types/analytics.types";

interface DailyActivityTimelineProps {
    data: DailyActivity[];
}

function safeDate(value: string): Date | null {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatMinutes(minutes: number): string {
    if (minutes <= 0) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}m`;
}

function formatDate(value: string): string {
    const date = safeDate(value);
    if (!date) return "Unknown date";
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

export default function DailyActivityTimeline({
    data,
}: DailyActivityTimelineProps) {
    const sortedData = useMemo(
        () =>
            [...data]
                .filter((item) => safeDate(item.date) !== null)
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() -
                        new Date(b.date).getTime()
                ),
        [data]
    );

    const totals = useMemo(
        () =>
            sortedData.reduce(
                (acc, item) => ({
                    attempts: acc.attempts + item.totalActivities,
                    questions: acc.questions + item.questionsSolved,
                    coding: acc.coding + item.codingCompleted,
                    mcq: acc.mcq + item.mcqsCompleted,
                    successful: acc.successful + item.successfulAttempts,
                    failed: acc.failed + item.failedAttempts,
                    time: acc.time + item.timeSpentMinutes,
                }),
                {
                    attempts: 0,
                    questions: 0,
                    coding: 0,
                    mcq: 0,
                    successful: 0,
                    failed: 0,
                    time: 0,
                }
            ),
        [sortedData]
    );

    if (sortedData.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-6">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Daily Activity
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                    Activity by day
                </h2>
                <div className="mt-6 rounded-xl border border-dashed border-[#1e3254] p-10 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No daily activity data yet.
                    </p>
                </div>
            </section>
        );
    }

    const maxAttempts = Math.max(
        ...sortedData.map((item) => item.totalActivities),
        1
    );

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Daily Activity
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Activity by day
                    </h2>
                    <p className="mt-1 max-w-xl text-xs text-[#617b9d]">
                        Each bar shows how many practice attempts you made that day. Hover a bar for the full breakdown.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">{totals.attempts}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Attempts</p>
                    </div>
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-[#17D4C3]">{totals.successful}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Passed</p>
                    </div>
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-[#e05c5c]">{totals.failed}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Failed</p>
                    </div>
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">{formatMinutes(totals.time)}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Time</p>
                    </div>
                </div>
            </div>

            <div className="mt-7 overflow-x-auto">
                <div className="min-w-[720px]">
                    <div className="flex h-52 items-end gap-2 border-b border-[#1e3254] px-1">
                        {sortedData.map((day) => {
                            const height = Math.max(
                                8,
                                (day.totalActivities / maxAttempts) * 100
                            );

                            return (
                                <div key={day.date}
                                    className="group relative flex h-full min-w-[42px] flex-1 items-end">
                                    <div className="relative flex h-full w-full items-end justify-center px-1">
                                        <div className="w-full max-w-9 rounded-t-md bg-[#17D4C3]/80 transition-all group-hover:bg-[#17D4C3]"
                                            style={{ height: `${height}%` }}/>

                                        <div className="pointer-events-none absolute bottom-[calc(100%-8px)] left-1/2 z-30 hidden w-48 -translate-x-1/2 rounded-lg border border-[#29466d] bg-[#081423] p-3 shadow-xl group-hover:block">
                                            <p className="text-xs font-semibold text-white">
                                                {formatDate(day.date)}
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-[#17D4C3]">
                                                {day.totalActivities} attempts
                                            </p>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-[#7189a8]">
                                                <span>Passed: {day.successfulAttempts}</span>
                                                <span>Failed: {day.failedAttempts}</span>
                                                <span>Questions: {day.questionsSolved}</span>
                                                <span>Coding: {day.codingCompleted}</span>
                                                <span>MCQ: {day.mcqsCompleted}</span>
                                                <span>Time: {formatMinutes(day.timeSpentMinutes)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex gap-2">
                        {sortedData.map((day) => (
                            <div key={`label-${day.date}`} className="min-w-[42px] flex-1 text-center">
                                <span className="text-[9px] text-[#526d8e]">
                                    {formatDate(day.date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-[11px] text-[#7189a8]">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#17D4C3]" />
                    Number of attempts
                </span>
                <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#17D4C3]" />
                    Passed {totals.successful}
                </span>
                <span className="flex items-center gap-1.5">
                    <XCircle size={13} className="text-[#e05c5c]" />
                    Failed {totals.failed}
                </span>
                <span className="flex items-center gap-1.5">
                    <Clock3 size={13} className="text-[#7189a8]" />
                    {formatMinutes(totals.time)} total time
                </span>
            </div>
        </section>
    );
}
