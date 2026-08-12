import { Activity, CheckCircle2, XCircle } from "lucide-react";
import type { DashboardActivity } from "../../../types/dashboard.types.ts";

interface RecentActivityProps {
    activities: DashboardActivity[];
}

export default function RecentActivity({
                                           activities,
                                       }: RecentActivityProps) {
    const recentActivities = [...activities]
        .sort(
            (a, b) =>
                new Date(b.activityDate).getTime() -
                new Date(a.activityDate).getTime()
        )
        .slice(0, 7);

    return (
        <section className="rounded-xl border border-[#1e3254] bg-[#0f1e35]">
            <div className="flex items-center justify-between border-b border-[#1e3254] px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-[#e8f0fe]">
                        Recent Activity
                    </h2>

                    <p className="mt-1 text-xs text-[#5f7898]">
                        Your latest practice activity
                    </p>
                </div>

                <Activity
                    size={18}
                    className="text-[#00e5c0]"
                />
            </div>

            {recentActivities.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <Activity
                        size={28}
                        className="mx-auto mb-3 text-[#38516f]"
                    />

                    <p className="text-sm text-[#7a99bb]">
                        No recent activity.
                    </p>

                    <p className="mt-1 text-xs text-[#4a6380]">
                        Your practice activity will appear here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-[#1e3254]">
                    {recentActivities.map((activity) => (
                        <div
                            key={activity.activityDate}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#102438]">
                                    <Activity
                                        size={16}
                                        className="text-[#00e5c0]"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#dce8f8]">
                                        {activity.totalAttempts}{" "}
                                        {activity.totalAttempts === 1
                                            ? "attempt"
                                            : "attempts"}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#5f7898]">
                                        {new Date(
                                            activity.activityDate
                                        ).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-[#65c7a7]">
                                    <CheckCircle2 size={13} />
                                    {activity.successfulAttempts}
                                </span>

                                <span className="flex items-center gap-1 text-xs text-[#e07a7a]">
                                    <XCircle size={13} />
                                    {activity.failedAttempts}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}