import { useEffect, useMemo, useState } from "react";
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
import TechnologiesPreview from "../components/TechnologiesPreview";
import RecommendedPractice from "../components/RecommendedPractice";
import CommunityPreview from "../components/CommunityPreview";
import AssistancePanel from "../components/AssistancePanel";
import ContributionCta from "../components/ContributionCta";
import type { DashboardResponse } from "../../../../types/dashboard.types";
import { getDashboard } from "../../../../api/dashboard.api.ts";

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

    const currentTopic = useMemo(() => {
        if (!dashboard?.topicAnalytics?.length) return null;

        return [...dashboard.topicAnalytics].sort((a, b) => {
            const dateA = a.lastPracticedAt
                ? new Date(a.lastPracticedAt).getTime()
                : 0;

            const dateB = b.lastPracticedAt
                ? new Date(b.lastPracticedAt).getTime()
                : 0;

            return dateB - dateA;
        })[0];
    }, [dashboard]);

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">

                    <div className="h-40 animate-pulse rounded-2xl bg-[#0f1e35]" />

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

    const overview = dashboard?.overview ?? null;
    const hasData = Boolean(overview);

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-7xl space-y-6 px-5 py-7 sm:px-6 lg:px-8">

                {/* HERO */}
                <DashboardHeader
                    hasData={hasData}
                    currentTopic={currentTopic}
                />

                {/* STATS */}
                {overview ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
                    <div className="rounded-xl border border-[#1e3254] bg-[#0f1e35] p-8 text-center">
                        <p className="text-sm text-[#7a99bb]">
                            No statistics available yet.
                        </p>

                        <p className="mt-1 text-xs text-[#4a6380]">
                            Start learning and practicing to build your dashboard.
                        </p>
                    </div>
                )}

                {/* CONTINUE LEARNING + QUICK ACTIONS */}
                <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                    <ContinueLearning
                        topics={dashboard?.topicAnalytics ?? []}
                    />

                    <QuickActions />
                </div>

                {/* TECHNOLOGIES */}
                <TechnologiesPreview />

                {/* PRACTICE + COMMUNITY */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <RecommendedPractice />
                    <CommunityPreview />
                </div>

                {/* ASSISTANCE + CONTRIBUTION */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <AssistancePanel />
                    <ContributionCta />
                </div>

                {/* RECENT ACTIVITY */}
                <RecentActivity
                    activities={dashboard?.practiceActivity ?? []}
                />

            </div>
        </div>
    );
}
