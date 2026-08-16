import {CheckCircle2, Clock3, Code2, FileQuestion, Target, XCircle,} from "lucide-react";
import type {AnalyticsOverview as AnalyticsOverviewData,} from "../../../../types/analytics.types";

interface AnalyticsOverviewProps {
    overview: AnalyticsOverviewData;
}

export default function AnalyticsOverview({
                                              overview,
                                          }: AnalyticsOverviewProps) {
    const stats = [
        {
            title: "Questions Solved",
            value: overview.questionsSolved,
            subtitle: "Total questions solved",
            icon: FileQuestion,
        },
        {
            title: "Coding Completed",
            value: overview.codingCompleted,
            subtitle: "Coding questions",
            icon: Code2,
        },
        {
            title: "MCQs Completed",
            value: overview.mcqsCompleted,
            subtitle: "Multiple choice",
            icon: Target,
        },
        {
            title: "Accepted",
            value: overview.acceptedSubmissions,
            subtitle: "Successful submissions",
            icon: CheckCircle2,
        },
        {
            title: "Failed Attempts",
            value: overview.failedAttempts,
            subtitle: "Unsuccessful submissions",
            icon: XCircle,
        },
        {
            title: "Total Attempts",
            value: overview.totalSubmissions,
            subtitle: "All submissions",
            icon: Target,
        },
        {
            title: "Time Spent",
            value: `${overview.totalTimeSpentMinutes}m`,
            subtitle: "Total learning time",
            icon: Clock3,
        },
    ];

    return (
        <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-[#1e3254] bg-[#0f1e35] p-5 transition-colors hover:border-[#29466d]"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[#6f89a8]">
                                        {stat.title}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-[#e8f0fe]">
                                        {stat.value}
                                    </p>

                                    <p className="mt-1 text-xs text-[#526d8e]">
                                        {stat.subtitle}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102f32] text-[#17D4C3]">
                                    <Icon size={18} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}