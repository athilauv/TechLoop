import { Search, X } from "lucide-react";
import { DifficultyLevel } from "../../../../types/enums/difficulty-level.ts";

export type DifficultyFilter = DifficultyLevel | "all";

export type SortOption =
    | "default"
    | "difficulty-asc"
    | "difficulty-desc";

export interface TechnologyFilter {
    id: number;
    name: string;
}

interface CodingQuestionFiltersProps {
    search: string;
    selectedDifficulty: DifficultyFilter;
    selectedTechnology: number | null;
    sortBy: SortOption;
    technologies: TechnologyFilter[];

    onSearchChange: (value: string) => void;
    onDifficultyChange: (value: DifficultyFilter) => void;
    onTechnologyChange: (value: number | null) => void;
    onSortChange: (value: SortOption) => void;
    onClear: () => void;
}

const CodingQuestionFilters = ({
                                   search,
                                   selectedDifficulty,
                                   selectedTechnology,
                                   sortBy,
                                   technologies,
                                   onSearchChange,
                                   onDifficultyChange,
                                   onTechnologyChange,
                                   onSortChange,
                                   onClear,
                               }: CodingQuestionFiltersProps) => {
    const difficultyOptions = Object.values(DifficultyLevel).filter(
        (value): value is DifficultyLevel =>
            typeof value === "number"
    );

    const getDifficultyLabel = (
        difficulty: DifficultyLevel
    ) => {
        const label = DifficultyLevel[difficulty];

        return typeof label === "string"
            ? label
            : String(difficulty);
    };

    const currentSearch = search ?? "";

    const hasFilters =
        currentSearch.trim().length > 0 ||
        selectedDifficulty !== "all" ||
        selectedTechnology !== null ||
        sortBy !== "default";

    return (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4">

                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={currentSearch}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search coding problems..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#17D4C3] focus:ring-2 focus:ring-[#17D4C3]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />

                    {currentSearch && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                    {/* Programming Language */}
                    <select
                        value={
                            selectedTechnology === null
                                ? "all"
                                : String(selectedTechnology)
                        }
                        onChange={(event) => {
                            const value = event.target.value;

                            onTechnologyChange(
                                value === "all"
                                    ? null
                                    : Number(value)
                            );
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#17D4C3] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <option value="all">
                            All Programming Languages
                        </option>

                        {(technologies ?? []).map(
                            (technology) => (
                                <option
                                    key={technology.id}
                                    value={technology.id}
                                >
                                    {technology.name}
                                </option>
                            )
                        )}
                    </select>

                    {/* Difficulty */}
                    <select
                        value={
                            selectedDifficulty === "all"
                                ? "all"
                                : String(selectedDifficulty)
                        }
                        onChange={(event) => {
                            const value = event.target.value;

                            onDifficultyChange(
                                value === "all"
                                    ? "all"
                                    : (Number(
                                        value
                                    ) as DifficultyLevel)
                            );
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#17D4C3] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <option value="all">
                            All Difficulties
                        </option>

                        {difficultyOptions.map(
                            (difficulty) => (
                                <option
                                    key={difficulty}
                                    value={difficulty}
                                >
                                    {getDifficultyLabel(
                                        difficulty
                                    )}
                                </option>
                            )
                        )}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(event) =>
                            onSortChange(
                                event.target
                                    .value as SortOption
                            )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#17D4C3] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <option value="default">
                            Default Order
                        </option>

                        <option value="difficulty-asc">
                            Easy → Hard
                        </option>

                        <option value="difficulty-desc">
                            Hard → Easy
                        </option>
                    </select>

                    {/* Clear */}
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <X size={15} />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodingQuestionFilters;