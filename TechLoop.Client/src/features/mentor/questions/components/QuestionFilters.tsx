import {
    Filter,
    Search,
    X,
} from "lucide-react";

import {
    DifficultyLevel,
    type DifficultyLevel as DifficultyLevelType,
} from "../../../../types/enums/difficulty-level.ts";

interface QuestionFiltersProps {
    search: string;
    difficulty: DifficultyLevelType | "all";
    onSearchChange: (value: string) => void;
    onDifficultyChange: (
        value: DifficultyLevelType | "all",
    ) => void;
    onClear: () => void;
}

const DIFFICULTY_OPTIONS: Array<{
    value: DifficultyLevelType | "all";
    label: string;
}> = [
    {
        value: "all",
        label: "All Difficulties",
    },
    {
        value: DifficultyLevel.Beginner,
        label: "Beginner",
    },
    {
        value: DifficultyLevel.Easy,
        label: "Easy",
    },
    {
        value: DifficultyLevel.Medium,
        label: "Medium",
    },
    {
        value: DifficultyLevel.Hard,
        label: "Hard",
    },
    {
        value: DifficultyLevel.Expert,
        label: "Expert",
    },
];

const QuestionFilters = ({
                             search,
                             difficulty,
                             onSearchChange,
                             onDifficultyChange,
                             onClear,
                         }: QuestionFiltersProps) => {
    const hasFilters =
        search.trim().length > 0 ||
        difficulty !== "all";

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Filter
                    size={17}
                    className="text-[var(--cs-text-muted)]"
                />

                <h2 className="text-sm font-semibold text-[var(--cs-text)]">
                    Filters
                </h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                    <Search
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value,
                            )
                        }
                        placeholder="Search questions..."
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)]"
                    />
                </div>

                <select
                    value={difficulty}
                    onChange={(event) => {
                        const value =
                            event.target.value;

                        if (value === "all") {
                            onDifficultyChange(
                                "all",
                            );
                            return;
                        }

                        onDifficultyChange(
                            Number(
                                value,
                            ) as DifficultyLevelType,
                        );
                    }}
                    className="rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                >
                    {DIFFICULTY_OPTIONS.map(
                        (option) => (
                            <option
                                key={String(
                                    option.value,
                                )}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ),
                    )}
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--cs-border)] px-4 py-2.5 text-sm font-medium text-[var(--cs-text-secondary)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                    >
                        <X size={16} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuestionFilters;