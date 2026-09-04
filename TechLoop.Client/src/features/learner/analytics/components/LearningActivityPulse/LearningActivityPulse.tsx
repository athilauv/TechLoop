import { useMemo } from "react";
import { CalendarDays, CheckCircle2, Flame, XCircle } from "lucide-react";
import type { DailyActivity } from "../../../../../types/analytics.types";

interface LearningActivityPulseProps {
    data: DailyActivity[];
}

function dateKey(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value.slice(0, 10);
    return date.toISOString().slice(0, 10);
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString(undefined, options);
}

function formatMinutes(minutes: number): string {
    if (minutes <= 0) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}m`;
}

export default function LearningActivityPulse({
    data,
}: LearningActivityPulseProps) {
    const days = useMemo(() => {
        const map = new Map<string, DailyActivity>();

        data.forEach((item) => {
            map.set(dateKey(item.date), item);
        });

        return Array.from(map.values()).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [data]);

    const recentDays = days.slice(-14);

    const summary = useMemo(() => {
        const totalActivities = data.reduce((sum, item) => sum + item.totalActivities, 0);
        const successful = data.reduce((sum, item) => sum + item.successfulAttempts, 0);
        const failed = data.reduce((sum, item) => sum + item.failedAttempts, 0);
        const activeDays = data.filter((item) => item.totalActivities > 0).length;
        const bestDay = [...days].sort(
            (a, b) => b.totalActivities - a.totalActivities
        )[0];

        return {
            totalActivities,
            successful,
            failed,
            activeDays,
            bestDay,
        };
    }, [data, days]);

    if (data.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Practice Activity
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                    Your practice rhythm
                </h2>
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <CalendarDays className="mx-auto mb-3 text-[#526d8e]" size={28} />
                    <p className="text-sm text-[#7189a8]">
                        No practice activity yet.
                    </p>
                    <p className="mt-1 text-xs text-[#526d8e]">
                        Start solving questions and your activity will appear here.
                    </p>
                </div>
            </section>
        );
    }

    const maxAttempts = Math.max(...recentDays.map((day) => day.totalActivities), 1);

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#17D4C3]">
                        <Flame size={15} />
                        <p className="text-xs font-semibold uppercase tracking-[1px]">
                            Practice Activity
                        </p>
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Your practice rhythm
                    </h2>
                    <p className="mt-1 max-w-xl text-xs text-[#617b9d]">
                        A simple view of how often you practiced recently. Taller bars mean more attempts that day.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">{summary.totalActivities}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Attempts</p>
                    </div>
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-[#17D4C3]">{summary.activeDays}</p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Active days</p>
                    </div>
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">
                            {summary.bestDay?.totalActivities ?? 0}
                        </p>
                        <p className="text-[9px] uppercase text-[#526d8e]">Best day</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <div className="min-w-[720px]">
                    <div className="grid grid-cols-14 items-end gap-2">
                        {recentDays.map((day) => {
                            const percentage = Math.max(8, (day.totalActivities / maxAttempts) * 100);

                            return (
                                <div key={dateKey(day.date)} className="group flex min-w-0 flex-col items-center">
                                    <div className="relative flex h-36 w-full items-end rounded-lg bg-[#0a1729] px-1">
                                        <div className="w-full rounded-md bg-[#17D4C3]/80 transition-all group-hover:bg-[#17D4C3]"
                                            style={{ height: `${percentage}%` }}/>

                                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-44 -translate-x-1/2 rounded-lg border border-[#29466d] bg-[#081423] p-3 shadow-xl group-hover:block">
                                            <p className="text-xs font-semibold text-white">
                                                {formatDate(day.date, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-[#17D4C3]">
                                                {day.totalActivities} attempts
                                            </p>
                                            <div className="mt-2 space-y-1 text-[10px] text-[#7189a8]">
                                                <p>Passed: {day.successfulAttempts}</p>
                                                <p>Failed: {day.failedAttempts}</p>
                                                <p>Questions solved: {day.questionsSolved}</p>
                                                <p>Time: {formatMinutes(day.timeSpentMinutes)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="mt-2 text-[10px] text-[#7189a8]">
                                        {formatDate(day.date, { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-[11px] text-[#7189a8]">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#17D4C3]" />
                    Practice attempts
                </span>
                <span className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-[#17D4C3]" />
                    {summary.successful} passed
                </span>
                <span className="flex items-center gap-2">
                    <XCircle size={13} className="text-[#e05c5c]" />
                    {summary.failed} failed
                </span>
            </div>
        </section>
    );
}
