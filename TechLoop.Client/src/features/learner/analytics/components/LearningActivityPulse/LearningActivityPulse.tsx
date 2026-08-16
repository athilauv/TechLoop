import { useMemo, useState } from "react";
import type { DailyActivity } from "../../../../../types/analytics.types";
import ActivityNode from "./ActivityNode";
import ActivityTooltip from "./ActivityTooltip";
import ActivityLegend from "./ActivityLegend";
import {getActivitySummary, getDateRange } from "./activityUtils";

interface LearningActivityPulseProps {
    data: DailyActivity[];
}

export default function LearningActivityPulse({
                                                  data,
                                              }: LearningActivityPulseProps) {
    const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
    const days = useMemo(() => getDateRange(data), [data],);
    const summary = useMemo(() => getActivitySummary(data), [data],);
    const activityMap = useMemo(() => {
        return new Map(data.map((item) => [item.date, item]),);
    }, [data]);

    const normalizedData = useMemo(() => {
        return days.map((date) => {
            return (activityMap.get(date) ?? {
                    date,
                    totalActivities: 0,
                    questionsSolved: 0,
                    codingCompleted: 0,
                    mcqsCompleted: 0,
                    successfulAttempts: 0,
                    failedAttempts: 0,
                    timeSpentMinutes: 0,
                }
            );
        });
    }, [days, activityMap]);

    const today = new Date().toISOString().slice(0, 10);

    if (data.length === 0) {
        return (
            <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                    Learning Activity
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                    Your activity pulse
                </h2>

                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No learning activity yet.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                        Learning Activity
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Your activity pulse
                    </h2>

                    <p className="mt-1 text-xs text-[#617b9d]">
                        Daily learning activity across TechLoop.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">
                            {summary.totalActivities}
                        </p>

                        <p className="text-[9px] uppercase text-[#526d8e]">
                            Activities
                        </p>
                    </div>

                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-[#17D4C3]">
                            {summary.totalMinutes}m
                        </p>

                        <p className="text-[9px] uppercase text-[#526d8e]">
                            Time
                        </p>
                    </div>

                    <div className="rounded-lg bg-[#0a1729] px-3 py-2 text-center">
                        <p className="text-sm font-bold text-white">
                            {summary.activeDays}
                        </p>

                        <p className="text-[9px] uppercase text-[#526d8e]">
                            Active days
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <div className="flex min-w-[720px] flex-wrap gap-3">
                    {normalizedData.map((activity) => (
                        <ActivityNode
                            key={activity.date}
                            activity={activity}
                            selected={selectedActivity?.date === activity.date}
                            today={activity.date === today}
                            onSelect={setSelectedActivity}
                        />
                    ))}
                </div>
            </div>

            {selectedActivity && (
                <div className="mt-5">
                    <ActivityTooltip
                        activity={selectedActivity}
                    />
                </div>
            )}

            <div className="mt-5">
                <ActivityLegend />
            </div>
        </section>
    );
}