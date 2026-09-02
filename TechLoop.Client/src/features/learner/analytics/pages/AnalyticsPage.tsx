import { useEffect, useState } from "react";
import AnalyticsHeader from "../components/AnalyticsHeader";
import AnalyticsOverview from "../components/AnalyticsOverview";
import LearningActivityPulse from "../components/LearningActivityPulse/LearningActivityPulse";
import DailyActivityTimeline from "../components/DailyActivityTimeline";
import PracticeOverview from "../components/PracticeOverview";
import TopicAnalytics from "../components/TopicAnalytics";
import DifficultyProgression from "../components/DifficultyProgression";
import { getAnalytics } from "../../../../api/analytics.api";
import type { AnalyticsResponse } from "../../../../types/analytics.types";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] =
        useState<AnalyticsResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAnalytics();

                if (!cancelled) {
                    setAnalytics(response);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load analytics."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadAnalytics();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-4 w-36 rounded bg-[#14253d]" />

                        <div className="mt-4 h-8 w-64 rounded bg-[#14253d]" />

                        <div className="mt-2 h-4 w-96 max-w-full rounded bg-[#14253d]" />

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 7 }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="h-32 rounded-xl border border-[#1e3254] bg-[#0f1e35]"
                                    />
                                )
                            )}
                        </div>

                        <div className="mt-6 h-80 rounded-2xl border border-[#1e3254] bg-[#0f1e35]" />

                        <div className="mt-6 h-80 rounded-2xl border border-[#1e3254] bg-[#0f1e35]" />

                        <div className="mt-6 h-80 rounded-2xl border border-[#1e3254] bg-[#0f1e35]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
                    <AnalyticsHeader hasData={false} />

                    <div className="mt-8 rounded-xl border border-[#5c3038] bg-[#24151b] p-5">
                        <p className="text-sm font-semibold text-[#ef8b8b]">
                            Unable to load analytics
                        </p>

                        <p className="mt-1 text-xs text-[#a96d76]">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-full bg-[#081423]">
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
                    <AnalyticsHeader hasData={false} />

                    <div className="mt-8 rounded-2xl border border-dashed border-[#1e3254] bg-[#0f1e35] p-12 text-center">
                        <p className="text-sm text-[#7189a8]">
                            No analytics data available yet.
                        </p>

                        <p className="mt-1 text-xs text-[#526d8e]">
                            Start practicing to build your learning analytics.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#081423]">
            <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
                <AnalyticsHeader
                    hasData={Boolean(analytics.overview)}
                />

                {analytics.overview && (
                    <div className="mt-8">
                        <AnalyticsOverview
                            overview={analytics.overview}
                        />
                    </div>
                )}

                <div className="mt-6">
                    <LearningActivityPulse data={analytics.dailyActivity ?? []}/>
                </div>

                <div className="mt-6">
                    <DailyActivityTimeline data={analytics.dailyActivity ?? []}/>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <PracticeOverview
                        technologies={
                            analytics.technologyPractice ?? []
                        }
                    />

                    <TopicAnalytics
                        topics={
                            analytics.topicAnalytics ?? []
                        }
                    />
                </div>

                <div className="mt-6">
                    <DifficultyProgression
                        difficulties={
                            analytics.difficultyProgression
                        }
                    />
                </div>
            </div>
        </div>
    );
}