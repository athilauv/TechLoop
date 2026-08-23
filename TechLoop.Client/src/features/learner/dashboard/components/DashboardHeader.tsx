import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../../../hooks/useCurrentUser.ts";
import type { DashboardTopic } from "../../../../types/dashboard.types.ts";

interface DashboardHeaderProps {
    hasData: boolean;
    currentTopic?: DashboardTopic | null;
}

export default function DashboardHeader({
                                            hasData,
                                            currentTopic,
                                        }: DashboardHeaderProps) {
    const { username } = useCurrentUser();
    const firstName = username?.split(/[\s._-]/)[0] || "there";

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#1e3254] bg-gradient-to-br from-[#0f1e35] via-[#0f1e35] to-[#0d2b2a] p-6 sm:p-8">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#17D4C3]/10 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#17D4C3]/25 bg-[#17D4C3]/10 px-3 py-1 text-xs font-medium text-[#17D4C3]">
                        <Sparkles size={13} />
                        {hasData && currentTopic
                            ? "Pick up where you left off"
                            : "Welcome to TechLoop"}
                    </div>

                    <h1 className="mt-3 text-2xl font-bold text-[#e8f0fe] sm:text-3xl">
                        {hasData && currentTopic
                            ? `Continue your learning journey, ${firstName}`
                            : `Let's get you started, ${firstName}`}
                    </h1>

                    <p className="mt-2 max-w-xl text-sm text-[#8ca3bf]">
                        {hasData && currentTopic
                            ? `You're ${currentTopic.completedQuestions} questions into ${currentTopic.topicName}. Keep the momentum going.`
                            : "Learn technologies, practice real questions, and get help from mentors and the community — all in one place."}
                    </p>
                </div>

                <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                    {hasData && currentTopic ? (
                        <Link
                            to="/learner/learning"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-5 py-3 text-sm font-semibold text-[#081423] transition hover:brightness-105"
                        >
                            Continue Learning
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    ) : (
                        <Link
                            to="/learner/learning"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#17D4C3] px-5 py-3 text-sm font-semibold text-[#081423] transition hover:brightness-105"
                        >
                            Start Learning
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    )}

                    <Link
                        to="/learner/coding-questions"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#17D4C3]/30 px-5 py-3 text-sm font-semibold text-[#17D4C3] transition hover:bg-[#17D4C3]/10"
                    >
                        Practice
                    </Link>
                </div>
            </div>
        </div>
    );
}
