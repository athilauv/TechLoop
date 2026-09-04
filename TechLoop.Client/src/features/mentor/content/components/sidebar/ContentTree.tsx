import { useMemo } from "react";
import { BookOpen, Plus, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMentorCurriculum } from "../../../../../api/mentor.api.ts";
import type { MentorCurriculum, MentorCurriculumTopic} from "../../../../../types/mentor.types.ts";
import Button from "../../../../../shared/Button.tsx";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";
import TopicTreeItem from "./TopicTreeItem";

interface ContentTreeProps {
    selectedType: "topic" | "subtopic" | null;
    selectedId: number | null;
    onSelectTopic: (id: number) => void;
    onSelectSubTopic: (id: number) => void;
    onCreateTopic: () => void;
    onCreateSubTopic: (topicId: number) => void;
    onEditSubTopic: (subTopicId: number) => void;
}

export default function ContentTree({
                                        selectedType,
                                        selectedId,
                                        onSelectTopic,
                                        onSelectSubTopic,
                                        onCreateTopic,
                                        onCreateSubTopic,
                                        onEditSubTopic,
                                    }: ContentTreeProps) {
    const {
        data: curriculum,
        isLoading,
        isError,
    } = useQuery<MentorCurriculum>({
        queryKey: ["mentor-curriculum"],
        queryFn: getMentorCurriculum,
    });

    const topics = useMemo<MentorCurriculumTopic[]>(() => {
        return [...(curriculum?.topics ?? [])].sort(
            (a, b) => a.position - b.position
        );
    }, [curriculum]);

    if (isLoading) {
        return (
            <aside className="flex h-full min-h-0 items-center justify-center bg-[var(--cs-bg-surface)]">
                <LoadingSpinner size="sm" label="Loading curriculum..." />
            </aside>
        );
    }

    if (isError || !curriculum) {
        return (
            <aside className="flex h-full min-h-0 flex-col items-center justify-center gap-3 bg-[var(--cs-bg-surface)] px-6 text-center">
                <TriangleAlert size={20} className="text-[var(--cs-danger)]" />
                <p className="text-sm text-[var(--cs-danger)]">
                    Unable to load curriculum.
                </p>
            </aside>
        );
    }

    return (
        <aside className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--cs-bg-surface)]">
            {/* HEADER */}
            <div className="sticky top-0 z-20 shrink-0 border-b border-[var(--cs-border)] bg-[var(--cs-bg-surface)] px-3 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-[var(--cs-accent)]">
                            Content Studio
                        </p>

                        <h2 className="mt-1 truncate text-lg font-semibold text-[var(--cs-text-primary)]">
                            {curriculum.technologyName}
                        </h2>
                    </div>

                    <div className="shrink-0 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg-card)] p-2">
                        <BookOpen size={17} className="text-[var(--cs-accent)]" />
                    </div>
                </div>

                <p className="mt-2 text-xs text-[var(--cs-text-muted)]">
                    {topics.length} {topics.length === 1 ? "topic" : "topics"}
                </p>

                <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus size={15} />}
                    onClick={onCreateTopic}
                    fullWidth
                    className="mt-4 w-full min-w-0 whitespace-nowrap py-2.5 hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-accent-subtle)] hover:text-[var(--cs-accent)]"
                >
                    Add Topic
                </Button>
            </div>

            {/* TREE */}
            <div className="cs-scroll min-h-0 flex-1 overflow-y-auto py-3">
                {topics.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm text-[var(--cs-text-muted)]">
                            No topics available.
                        </p>
                    </div>
                ) : (
                    topics.map((topic) => (
                        <TopicTreeItem
                            key={topic.id}
                            topic={topic}
                            selectedType={selectedType}
                            selectedId={selectedId}
                            onSelectTopic={onSelectTopic}
                            onSelectSubTopic={onSelectSubTopic}
                            onCreateSubTopic={onCreateSubTopic}
                            onEditSubTopic={onEditSubTopic}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}