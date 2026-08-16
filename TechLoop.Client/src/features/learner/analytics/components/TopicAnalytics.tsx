import type {
    TopicAnalytics as TopicAnalyticsData,
} from "../../../../types/analytics.types";

interface TopicAnalyticsProps {
    topics: TopicAnalyticsData[];
}

export default function TopicAnalytics({
                                           topics,
                                       }: TopicAnalyticsProps) {
    return (
        <section className="rounded-2xl border border-[#1e3254] bg-[#0f1e35] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[1px] text-[#17D4C3]">
                Topics
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
                Learning depth
            </h2>

            {topics.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#1e3254] p-8 text-center">
                    <p className="text-sm text-[#7189a8]">
                        No topic progress yet.
                    </p>
                </div>
            ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {topics.map((topic) => (
                        <div
                            key={topic.topicId}
                            className="rounded-xl border border-[#1e3254] bg-[#0b182b] p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-white">
                                    {topic.topicName}
                                </p>

                                <span className="rounded-full bg-[#102f32] px-2 py-1 text-[10px] font-semibold text-[#17D4C3]">
                                    {topic.completedQuestions}
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-[#617b9d]">
                                questions completed
                            </p>

                            {topic.lastPracticedAt && (
                                <p className="mt-3 text-[11px] text-[#526d8e]">
                                    Last practiced{" "}
                                    {new Date(
                                        topic.lastPracticedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}