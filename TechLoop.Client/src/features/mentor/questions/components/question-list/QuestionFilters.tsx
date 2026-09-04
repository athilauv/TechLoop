import { Filter, Search, X } from "lucide-react";
import { type DifficultyLevel as DifficultyLevelType } from "../../../../../types/enums/difficulty-level.ts";
import CustomSelect, { type SelectOption } from "../../../../../shared/Customselect.tsx";
import { useDifficultyLevels } from "../../../../../hooks/useLookups.ts";

interface QuestionFiltersProps {
    search: string;
    difficulty: DifficultyLevelType | "all";
    onSearchChange: (value: string) => void;
    onDifficultyChange: (value: DifficultyLevelType | "all") => void;
    onClear: () => void;
}

const QuestionFilters = ({
                             search,
                             difficulty,
                             onSearchChange,
                             onDifficultyChange,
                             onClear,
                         }: QuestionFiltersProps) => {
    const { data: difficultyLevels = [] } = useDifficultyLevels();
    const difficultyOptions: Array<SelectOption<DifficultyLevelType | "all">> = [
        { value: "all", label: "All difficulties" },
        ...(difficultyLevels ?? []).map((item) => ({
            value: item.id as DifficultyLevelType,
            label: item.name,
        })),
    ];

    const hasFilters = search.trim().length > 0 || difficulty !== "all";

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative min-w-[200px] flex-1">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search questions..."
                    className="w-full rounded-lg bg-[var(--cs-surface-muted)] py-2.5 pl-9 pr-3 text-sm text-[var(--cs-text)] outline-none ring-1 ring-inset ring-[var(--cs-border)]/60 placeholder:text-[var(--cs-text-muted)] transition-shadow focus:ring-2 focus:ring-[var(--cs-primary)]/40"
                />
            </div>

            <div className="flex items-center gap-2 text-[var(--cs-text-muted)] sm:shrink-0">
                <Filter size={15} className="hidden sm:block" />
                <div className="w-full sm:w-[190px]">
                    <CustomSelect
                        value={difficulty}
                        options={difficultyOptions}
                        onChange={onDifficultyChange}
                        placeholder="All difficulties"
                    />
                </div>
            </div>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--cs-text-secondary)] transition-colors hover:bg-[var(--cs-surface-muted)] hover:text-[var(--cs-text)]"
                >
                    <X size={15} />
                    Clear
                </button>
            )}
        </div>
    );
};

export default QuestionFilters;
