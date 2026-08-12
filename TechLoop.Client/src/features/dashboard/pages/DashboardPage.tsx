import { useEffect, useState } from "react";
import {
    Award,
    Code2,
    FileQuestion,
    Target,
} from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStatCard from "../components/DashboardStatCard";
import ContinueLearning from "../components/ContinueLearning";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import type { DashboardResponse } from "../../../types/dashboard.types";
import { getDashboard } from "../../../api/dashboard.api.ts";

export default function DashboardPage() {
    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getDashboard();

                setDashboard(response);
            } catch (err: unknown) {
                console.error("Failed to load dashboard:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        void loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">

                    <div className="h-5 w-32 animate-pulse rounded bg-[#14253d]" />

                    <div className="mt-3 h-8 w-56 animate-pulse rounded bg-[#14253d]" />

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-xl border border-[#1e3254] bg-[#0f1e35]"
                            />
                        ))}
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">

                    <DashboardHeader hasData={false} />

                    <div className="mt-8 rounded-xl border border-[#5c3038] bg-[#24151b] p-5">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load dashboard
                        </p>

                        <p className="mt-1 text-xs text-[#a96d76]">
                            {error}
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
                    <DashboardHeader hasData={false} />
                </div>
            </div>
        );
    }

    const overview = dashboard.overview;

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">

                {/* HEADER */}
                <DashboardHeader hasData={Boolean(overview)} />

                {/* STATS */}
                {overview ? (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <DashboardStatCard
                            title="Questions Solved"
                            value={overview.questionsSolved}
                            icon={<FileQuestion size={19} />}
                            subtitle="Total questions"
                        />

                        <DashboardStatCard
                            title="Coding Completed"
                            value={overview.codingCompleted}
                            icon={<Code2 size={19} />}
                            subtitle="Coding questions"
                        />

                        <DashboardStatCard
                            title="MCQs Completed"
                            value={overview.mcqsCompleted}
                            icon={<Target size={19} />}
                            subtitle="Multiple choice questions"
                        />

                        <DashboardStatCard
                            title="Learning Time"
                            value={`${overview.totalTimeSpentMinutes}m`}
                            icon={<Award size={19} />}
                            subtitle="Total time spent"
                        />

                    </div>
                ) : (
                    <div className="mt-8 rounded-xl border border-[#1e3254] bg-[#0f1e35] p-8 text-center">
                        <p className="text-sm text-[#7a99bb]">
                            No statistics available yet.
                        </p>

                        <p className="mt-1 text-xs text-[#4a6380]">
                            Start learning and practicing to build your dashboard.
                        </p>
                    </div>
                )}

                {/* MAIN CONTENT */}
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">

                    <ContinueLearning
                        topics={dashboard.topicAnalytics}
                    />

                    <RecentActivity
                        activities={dashboard.practiceActivity}
                    />

                </div>

                {/* QUICK ACTIONS */}
                <div className="mt-6">
                    <QuickActions />
                </div>

            </div>
        </div>
    );
}