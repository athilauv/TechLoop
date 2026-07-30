import { ChevronDown, ChevronRight, BookOpen, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Technology } from "../types/Technology";
import type { Topic } from "../types/Topic";
import type { SubTopic } from "../types/SubTopic";

interface CurriculumSidebarProps {
    technology: Technology;
    topics: Topic[];
    subTopics: SubTopic[];
    mode: "introduction" | "topic";
    activeTopicId: number | null;
    activeSubTopicSlug: string | null;
    onIntroSelect: () => void;
    onTopicSelect: (topic: Topic) => void;
    onSubTopicSelect: (subTopic: SubTopic) => void;
}

export default function CurriculumSidebar({
                                              technology,
                                              topics,
                                              subTopics,
                                              mode,
                                              activeTopicId,
                                              activeSubTopicSlug,
                                              onIntroSelect,
                                              onTopicSelect,
                                              onSubTopicSelect,
                                          }: CurriculumSidebarProps) {
    const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (activeTopicId === null) return;

        setExpandedTopics((prev) => new Set([...prev, activeTopicId]));
    }, [activeTopicId]);

    const groupedSubTopics = useMemo(() => {
        return topics.reduce((acc, topic) => {
            acc[topic.id] = subTopics
                .filter((x) => x.topicId === topic.id)
                .sort((a, b) => a.position - b.position);

            return acc;
        }, {} as Record<number, SubTopic[]>);
    }, [topics, subTopics]);

    function toggleTopic(topicId: number) {
        setExpandedTopics((prev) => {
            const next = new Set(prev);

            if (next.has(topicId)) {
                next.delete(topicId);
            } else {
                next.add(topicId);
            }

            return next;
        });
    }

    return (
        <aside className="w-[340px] shrink-0 border-r border-white/5 bg-[#0A1930] overflow-y-auto">
            <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0A1930] px-6 py-5 backdrop-blur">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17D4C3]/15">
                        <BookOpen size={20} className="text-[#17D4C3]" />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500">Curriculum</p>
                        <h2 className="mt-1 text-lg font-semibold text-white">{technology.name}</h2>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Introduction */}
                <button
                    onClick={onIntroSelect}
                    className={`mb-3 flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-[#0E192A] px-5 py-4 text-left transition ${
                        mode === "introduction" ? "border-[#17D4C3]/40 bg-[#17D4C3]/10" : "hover:bg-white/5"
                    }`}
                >
                    <Sparkles
                        size={18}
                        className={mode === "introduction" ? "text-[#17D4C3]" : "text-slate-500"}
                    />

                    <div>
                        <p className="text-[11px] uppercase tracking-widest text-slate-500">Introduction</p>
                        <h3 className="font-semibold text-white">Introduction to {technology.name}</h3>
                    </div>
                </button>

                {/* Topics */}
                {topics.map((topic) => {
                    const isExpanded = expandedTopics.has(topic.id);
                    const isActiveTopic = mode === "topic" && activeTopicId === topic.id;
                    const lessons = groupedSubTopics[topic.id] ?? [];

                    return (
                        <div
                            key={topic.id}
                            className="mb-3 overflow-hidden rounded-2xl border border-white/5 bg-[#0E192A]"
                        >
                            <button
                                onClick={() => {
                                    toggleTopic(topic.id);
                                    onTopicSelect(topic);
                                }}
                                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                                    isActiveTopic ? "bg-[#17D4C3]/10" : "hover:bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown size={18} className="text-[#17D4C3]" />
                                    ) : (
                                        <ChevronRight size={18} className="text-slate-500" />
                                    )}

                                    <div>
                                        <h3 className="font-semibold text-white">{topic.title}</h3>
                                        <p className="text-xs text-slate-500">{lessons.length} Lessons</p>
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-white/5">
                                    {lessons.map((lesson) => {
                                        const isSelected =
                                            mode === "topic" && activeSubTopicSlug === lesson.slug;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => onSubTopicSelect(lesson)}
                                                className={`flex w-full items-center gap-3 px-6 py-3 text-left transition ${
                                                    isSelected
                                                        ? "bg-[#17D4C3]/10 text-white"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <CheckCircle2 size={17} className="shrink-0 text-[#17D4C3]" />
                                                ) : (
                                                    <Circle size={15} className="shrink-0 text-slate-600" />
                                                )}

                                                <span className="text-sm">{lesson.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
