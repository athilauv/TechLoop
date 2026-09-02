import { Activity, CheckCircle2, XCircle } from "lucide-react";
import type { DashboardActivity } from "../../../../types/dashboard.types.ts";

interface RecentActivityProps {
    activities: DashboardActivity[];
}

export default function RecentActivity({
                                           activities,
                                       }: RecentActivityProps) {
    const recentActivities = [...activities]
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, 7);

    const formatDate = (value: string) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Unknown date";
        }

        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

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
                    className="text-[#17D4C3]"
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
                    {recentActivities.map((activity, index) => (
                        <div
                            key={`${activity.date}-${activity.totalAttempts}-${activity.successfulAttempts}-${activity.failedAttempts}-${index}`}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17D4C3]/15">
                                    <Activity
                                        size={16}
                                        className="text-[#17D4C3]"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#e8f0fe]">
                                        {formatDate(activity.date)}
                                    </p>

                                    <p className="mt-1 text-xs text-[#5f7898]">
                                        {activity.totalAttempts}{" "}
                                        {activity.totalAttempts === 1
                                            ? "attempt"
                                            : "attempts"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2
                                        size={14}
                                        className="text-[#17D4C3]"
                                    />

                                    <span className="text-xs font-semibold text-[#17D4C3]">
                                        {activity.successfulAttempts}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <XCircle
                                        size={14}
                                        className="text-[#e05c5c]"
                                    />

                                    <span className="text-xs font-semibold text-[#e05c5c]">
                                        {activity.failedAttempts}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}