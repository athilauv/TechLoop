import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { getMentorCurriculum} from "../../../../api/mentor.api.ts";
import type {
    MentorCurriculum,
    MentorCurriculumTopic,
    MentorCurriculumSubTopic
} from "../../../../types/mentor.types.ts";

interface QuestionCurriculumSelectProps {
    topicId: number | null;
    subTopicId: number | null;
    onTopicChange: (topicId: number | null) => void;
    onSubTopicChange: (subTopicId: number | null) => void;
    disabled?: boolean;
}

const QuestionCurriculumSelect = ({
                                      topicId,
                                      subTopicId,
                                      onTopicChange,
                                      onSubTopicChange,
                                      disabled = false,
                                  }: QuestionCurriculumSelectProps) => {
    const [curriculum, setCurriculum] =
        useState<MentorCurriculum | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [topicSearch, setTopicSearch] = useState("");
    const [subTopicSearch, setSubTopicSearch] =
        useState("");

    const [topicOpen, setTopicOpen] = useState(false);
    const [subTopicOpen, setSubTopicOpen] =
        useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadCurriculum = async () => {
            try {
                const result = await getMentorCurriculum();

                if (cancelled) {
                    return;
                }

                setCurriculum(result);
                setError(null);
            } catch {
                if (!cancelled) {
                    setCurriculum(null);
                    setError(
                        "Unable to load your curriculum.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadCurriculum();

        return () => {
            cancelled = true;
        };
    }, []);

    const selectedTopic = useMemo<MentorCurriculumTopic | null>(
        () =>
            curriculum?.topics.find(
                (topic) => topic.id === topicId,
            ) ?? null,
        [curriculum, topicId],
    );

    const selectedSubTopic =
        selectedTopic?.subTopics.find(
            (subTopic) => subTopic.id === subTopicId,
        ) ?? null;

    const filteredTopics = useMemo(() => {
        const search = topicSearch.trim().toLowerCase();

        if (!search) {
            return curriculum?.topics ?? [];
        }

        return (
            curriculum?.topics.filter((topic) =>
                topic.title
                    .toLowerCase()
                    .includes(search),
            ) ?? []
        );
    }, [curriculum, topicSearch]);

    const filteredSubTopics = useMemo(() => {
        if (!selectedTopic) {
            return [];
        }

        const search =
            subTopicSearch.trim().toLowerCase();

        if (!search) {
            return selectedTopic.subTopics;
        }

        return selectedTopic.subTopics.filter(
            (subTopic) =>
                subTopic.title
                    .toLowerCase()
                    .includes(search),
        );
    }, [selectedTopic, subTopicSearch]);

    const handleTopicSelect = (
        topic: MentorCurriculumTopic,
    ) => {
        onTopicChange(topic.id);
        onSubTopicChange(null);

        setTopicSearch("");
        setSubTopicSearch("");
        setTopicOpen(false);
        setSubTopicOpen(false);
    };

    const handleSubTopicSelect = (
        subTopic: MentorCurriculumSubTopic,
    ) => {
        onSubTopicChange(subTopic.id);

        setSubTopicSearch("");
        setSubTopicOpen(false);
    };

    if (loading) {
        return (
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Topic
                    </label>

                    <div className="h-11 animate-pulse rounded-lg bg-[var(--cs-surface-muted)]" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Sub Topic
                    </label>

                    <div className="h-11 animate-pulse rounded-lg bg-[var(--cs-surface-muted)]" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] px-4 py-3 text-sm text-[var(--cs-danger)]">
                {error}
            </div>
        );
    }

    return (
        <div className="grid gap-5 md:grid-cols-2">
            {/* Topic */}

            <div className="relative">
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Topic
                </label>

                <button
                    type="button"
                    disabled={
                        disabled ||
                        !curriculum ||
                        curriculum.topics.length === 0
                    }
                    onClick={() =>
                        setTopicOpen((previous) => !previous)
                    }
                    className="flex w-full items-center justify-between rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5 text-left text-sm text-[var(--cs-text)] outline-none transition-colors hover:bg-[var(--cs-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span
                        className={
                            selectedTopic
                                ? "text-[var(--cs-text)]"
                                : "text-[var(--cs-text-muted)]"
                        }
                    >
                        {selectedTopic
                            ? selectedTopic.title
                            : "Select a topic"}
                    </span>

                    <ChevronDown
                        size={17}
                        className="text-[var(--cs-text-muted)]"
                    />
                </button>

                {topicOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-xl">
                        <div className="border-b border-[var(--cs-border)] p-2">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                                />

                                <input
                                    value={topicSearch}
                                    onChange={(event) =>
                                        setTopicSearch(
                                            event.target.value,
                                        )
                                    }
                                    autoFocus
                                    placeholder="Search topics..."
                                    className="w-full rounded-md border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] py-2 pl-9 pr-3 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)]"
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto p-1">
                            {filteredTopics.length === 0 ? (
                                <p className="px-3 py-4 text-center text-sm text-[var(--cs-text-muted)]">
                                    No topics found.
                                </p>
                            ) : (
                                filteredTopics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        type="button"
                                        onClick={() =>
                                            handleTopicSelect(
                                                topic,
                                            )
                                        }
                                        className={[
                                            "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                                            topic.id === topicId
                                                ? "bg-[var(--cs-primary)]/10 text-[var(--cs-primary)]"
                                                : "text-[var(--cs-text)] hover:bg-[var(--cs-surface-muted)]",
                                        ].join(" ")}
                                    >
                                        {topic.title}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sub Topic */}

            <div className="relative">
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Sub Topic
                </label>

                <button
                    type="button"
                    disabled={
                        disabled ||
                        !selectedTopic
                    }
                    onClick={() =>
                        setSubTopicOpen(
                            (previous) => !previous,
                        )
                    }
                    className="flex w-full items-center justify-between rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5 text-left text-sm text-[var(--cs-text)] outline-none transition-colors hover:bg-[var(--cs-surface-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span
                        className={
                            selectedSubTopic
                                ? "text-[var(--cs-text)]"
                                : "text-[var(--cs-text-muted)]"
                        }
                    >
                        {selectedSubTopic
                            ? selectedSubTopic.title
                            : selectedTopic
                                ? "Select a sub topic"
                                : "Select a topic first"}
                    </span>

                    <ChevronDown
                        size={17}
                        className="text-[var(--cs-text-muted)]"
                    />
                </button>

                {subTopicOpen && selectedTopic && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-xl">
                        <div className="border-b border-[var(--cs-border)] p-2">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                                />

                                <input
                                    value={
                                        subTopicSearch
                                    }
                                    onChange={(event) =>
                                        setSubTopicSearch(
                                            event.target.value,
                                        )
                                    }
                                    autoFocus
                                    placeholder="Search sub topics..."
                                    className="w-full rounded-md border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] py-2 pl-9 pr-3 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)]"
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto p-1">
                            {filteredSubTopics.length === 0 ? (
                                <p className="px-3 py-4 text-center text-sm text-[var(--cs-text-muted)]">
                                    No sub topics found.
                                </p>
                            ) : (
                                filteredSubTopics.map(
                                    (subTopic) => (
                                        <button
                                            key={
                                                subTopic.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSubTopicSelect(
                                                    subTopic,
                                                )
                                            }
                                            className={[
                                                "w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                                                subTopic.id ===
                                                subTopicId
                                                    ? "bg-[var(--cs-primary)]/10 text-[var(--cs-primary)]"
                                                    : "text-[var(--cs-text)] hover:bg-[var(--cs-surface-muted)]",
                                            ].join(" ")}
                                        >
                                            {
                                                subTopic.title
                                            }
                                        </button>
                                    ),
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCurriculumSelect;