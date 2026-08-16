import { BookOpen, Clock3, ArrowRight } from "lucide-react";
import type { DashboardTopic } from "../../../../types/dashboard.types.ts";

interface ContinueLearningProps {
    topics: DashboardTopic[];
}

export default function ContinueLearning({
                                             topics,
                                         }: ContinueLearningProps) {
    const recentTopics = [...topics]
        .sort((a, b) => {
            const dateA = a.lastPracticedAt
                ? new Date(a.lastPracticedAt).getTime()
                : 0;

            const dateB = b.lastPracticedAt
                ? new Date(b.lastPracticedAt).getTime()
                : 0;

            return dateB - dateA;
        })
        .slice(0, 3);

    return (
        <section className="rounded-xl border border-[#1e3254] bg-[#0f1e35]">
            <div className="flex items-center justify-between border-b border-[#1e3254] px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-[#e8f0fe]">
                        Continue Learning
                    </h2>

                    <p className="mt-1 text-xs text-[#5f7898]">
                        Pick up where you left off
                    </p>
                </div>

                <BookOpen size={18} className="text-[#00e5c0]" />
            </div>

            {recentTopics.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <BookOpen
                        size={28}
                        className="mx-auto mb-3 text-[#38516f]"
                    />

                    <p className="text-sm text-[#7a99bb]">
                        No learning progress yet.
                    </p>

                    <p className="mt-1 text-xs text-[#4a6380]">
                        Start learning a topic to see it here.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-[#1e3254]">
                    {recentTopics.map((topic) => (
                        <div
                            key={topic.topicId}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#dce8f8]">
                                    {topic.topicName}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-xs text-[#5f7898]">
                                    <span>
                                        {topic.completedQuestions} questions
                                        completed
                                    </span>

                                    {topic.lastPracticedAt && (
                                        <>
                                            <span>•</span>

                                            <Clock3 size={12} />

                                            <span>
                                                {new Date(
                                                    topic.lastPracticedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <ArrowRight
                                size={16}
                                className="ml-4 flex-shrink-0 text-[#496582]"
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}