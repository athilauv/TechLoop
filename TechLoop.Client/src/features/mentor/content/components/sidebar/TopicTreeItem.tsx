import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import type { MentorCurriculumTopic } from "../../../../../types/mentor.types.ts";
import { cn } from "../../../../../shared/cn.ts";
import SubTopicTreeItem from "./SubTopicTreeItem";

interface TopicTreeItemProps {
    topic: MentorCurriculumTopic;
    selectedType: "topic" | "subtopic" | null;
    selectedId: number | null;
    onSelectTopic: (id: number) => void;
    onSelectSubTopic: (id: number) => void;
    onCreateSubTopic: (topicId: number) => void;
    onEditSubTopic: (subTopicId: number) => void;
}

export default function TopicTreeItem({
                                          topic,
                                          selectedType,
                                          selectedId,
                                          onSelectTopic,
                                          onSelectSubTopic,
                                          onCreateSubTopic,
                                          onEditSubTopic,
                                      }: TopicTreeItemProps) {
    const [open, setOpen] = useState(true);

    const sortedSubTopics = [...(topic.subTopics ?? [])].sort(
        (a, b) => a.position - b.position
    );

    const topicSelected = selectedType === "topic" && selectedId === topic.id;
    const subTopicCount = sortedSubTopics.length;

    return (
        <div className="border-b border-white/5">
            {/* TOPIC ROW */}
            <div
                className={cn(
                    "group flex items-center gap-2 px-3 py-1 transition",
                    topicSelected
                        ? "bg-[var(--cs-accent-subtle)]"
                        : "hover:bg-white/5"
                )}
            >
                <button
                    type="button"
                    aria-label={open ? `Collapse ${topic.title}` : `Expand ${topic.title}`}
                    onClick={() => setOpen((previous) => !previous)}
                    className="shrink-0 rounded-md p-1.5 text-[var(--cs-text-muted)] transition hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                >
                    <ChevronDown
                        size={16}
                        className={cn(
                            "transition-transform duration-200",
                            open ? "rotate-180" : ""
                        )}
                    />
                </button>

                <button
                    type="button"
                    onClick={() => onSelectTopic(topic.id)}
                    className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 py-2.5 text-left text-sm font-medium transition",
                        topicSelected
                            ? "text-[var(--cs-accent)]"
                            : "text-[var(--cs-text-primary)]"
                    )}
                >
                    <span className="min-w-0 truncate">{topic.title}</span>

                    {subTopicCount > 0 && (
                        <span
                            className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                                topicSelected
                                    ? "bg-[var(--cs-accent)]/20 text-[var(--cs-accent)]"
                                    : "bg-white/5 text-[var(--cs-text-muted)]"
                            )}
                        >
                            {subTopicCount}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    title={`Add subtopic to ${topic.title}`}
                    aria-label={`Add subtopic to ${topic.title}`}
                    onClick={() => onCreateSubTopic(topic.id)}
                    className="shrink-0 rounded-md p-1.5 text-[var(--cs-text-muted)] opacity-0 transition hover:bg-[var(--cs-accent-subtle)] hover:text-[var(--cs-accent)] group-hover:opacity-100 focus:opacity-100"
                >
                    <Plus size={15} />
                </button>
            </div>

            {/* SUBTOPICS */}
            {open && (
                <div className="pb-2">
                    {sortedSubTopics.length === 0 ? (
                        <div className="ml-12 mr-4 rounded-md px-3 py-2">
                            <p className="text-xs text-[var(--cs-text-muted)]">
                                No subtopics yet.
                            </p>
                        </div>
                    ) : (
                        sortedSubTopics.map((subTopic) => (
                            <SubTopicTreeItem
                                key={subTopic.id}
                                subTopic={subTopic}
                                selected={
                                    selectedType === "subtopic" &&
                                    selectedId === subTopic.id
                                }
                                onSelect={() => onSelectSubTopic(subTopic.id)}
                                onEdit={onEditSubTopic}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}