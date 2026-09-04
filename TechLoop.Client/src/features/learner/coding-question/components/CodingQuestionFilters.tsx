import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { type DifficultyLevel } from "../../../../types/enums/difficulty-level.ts";
import { useDifficultyLevels } from "../../../../hooks/useLookups.ts";

export type DifficultyFilter = DifficultyLevel | "all";
export type SortOption = | "default" | "difficulty-asc" | "difficulty-desc";
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

type DropdownType = | "technology" | "difficulty" | "sort" | null;

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
    const { data: difficultyLevels = [] } = useDifficultyLevels();
    const difficultyOptions = (difficultyLevels ?? []).map((item) => item.id as DifficultyLevel);

    const getDifficultyLabel = (difficulty: DifficultyLevel): string =>
        difficultyLevels.find((item) => item.id === difficulty)?.name ?? String(difficulty);

    const [openDropdown, setOpenDropdown] =
        useState<DropdownType>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const currentSearch = search ?? "";

    const hasFilters = currentSearch.trim().length > 0 ||
        selectedDifficulty !== "all" || selectedTechnology !== null || sortBy !== "default";

    const toggleDropdown = (
        dropdown: Exclude<DropdownType, null>,
    ) => {
        setOpenDropdown((current) =>
            current === dropdown ? null : dropdown);
    };

    const selectedTechnologyName = selectedTechnology === null
            ? "All Programming Languages" : technologies.find((technology) =>
                    technology.id === selectedTechnology)?.name ?? "All Programming Languages";

    const selectedDifficultyName = selectedDifficulty === "all"
            ? "All Difficulties" : getDifficultyLabel(selectedDifficulty);

    const selectedSortName = sortBy === "default"
            ? "Default Order" : sortBy === "difficulty-asc" ? "Easy → Hard" : "Hard → Easy";

    return (
        <div ref={containerRef}
            className="relative mb-6 rounded-2xl border border-[#223A59] bg-[#14243C] p-4">
            <div className="flex flex-col gap-4">

                {/* Search */}
                <div className="relative">
                    <Search size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5C7394]"/>

                    <input
                        type="text"
                        value={currentSearch}
                        onChange={(event) =>
                            onSearchChange(event.target.value)}
                        placeholder="Search coding questions..."
                        className="
                            w-full
                            rounded-lg
                            border
                            border-[#223A59]
                            bg-[#101C30]
                            py-2.5
                            pl-10
                            pr-10
                            text-sm
                            text-white
                            placeholder:text-[#5C7394]
                            outline-none
                            transition
                            focus:border-[#00E8C2]
                            focus:ring-2
                            focus:ring-[#00E8C2]/25"/>

                    {currentSearch && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-[#5C7394]
                                transition
                                hover:text-white
                            "
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                    {/* Technology */}
                    <div className="relative min-w-[220px]">
                        <button
                            type="button"
                            onClick={() => toggleDropdown("technology",)
                            }
                            className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#223A59] bg-[#101C30] px-3 py-2.5
                                text-left text-sm text-[#B9C8DC] outline-none transition hover:border-[#00E8C2]/60 focus:border-[#00E8C2]">
                            <span className="truncate">
                                {selectedTechnologyName}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`shrink-0 text-[#5C7394] transition-transform
                                    ${openDropdown === "technology" ? "rotate-180" : ""}`}/>
                        </button>

                        {openDropdown === "technology" && (
                                <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-full
                                    overflow-y-auto rounded-xl border border-[#223A59] bg-[#0E1B2D] p-1.5 shadow-2xl">
                                    <button type="button"
                                        onClick={() => {
                                            onTechnologyChange(null);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition
                                        ${selectedTechnology === null ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"}
                                    `}>
                                        All Programming
                                        Languages
                                    </button>

                                    {(technologies ?? []).map((technology) => (
                                            <button
                                                key={technology.id}
                                                type="button"
                                                onClick={() => {
                                                    onTechnologyChange(technology.id);
                                                    setOpenDropdown(null);
                                                }}
                                                className={` w-full rounded-lg px-3 py-2.5 text-left text-sm transition
                                                ${selectedTechnology === technology.id
                                                        ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"}
                                           `}>
                                                {technology.name}
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Difficulty */}
                    <div className="relative min-w-[180px]">
                        <button
                            type="button"
                            onClick={() =>
                                toggleDropdown("difficulty")}
                            className="flex w-full items-center justify-between gap-3 rounded-lg
                                border border-[#223A59] bg-[#101C30] px-3 py-2.5 text-left text-sm text-[#B9C8DC]
                                outline-none transition hover:border-[#00E8C2]/60 focus:border-[#00E8C2]">
                            <span className="truncate">
                                {selectedDifficultyName}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`shrink-0 text-[#5C7394] transition-transform
                                    ${openDropdown === "difficulty" ? "rotate-180" : ""}
                                `}
                            />
                        </button>

                        {openDropdown === "difficulty" && (
                                <div className="absolute left-0
                                    top-full
                                    z-50
                                    mt-2
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#223A59]
                                    bg-[#0E1B2D]
                                    p-1.5
                                    shadow-2xl
                                "
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onDifficultyChange(
                                                "all",
                                            );
                                            setOpenDropdown(
                                                null,
                                            );
                                        }}
                                        className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        transition
                                        ${selectedDifficulty === "all" ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"}
                                    `}>
                                        All Difficulties
                                    </button>

                                    {difficultyOptions.map(
                                        (difficulty) => (
                                            <button
                                                key={difficulty}
                                                type="button"
                                                onClick={() => {
                                                    onDifficultyChange(difficulty);
                                                    setOpenDropdown(null);
                                                }}
                                                className={`
                                                w-full
                                                rounded-lg
                                                px-3
                                                py-2.5
                                                text-left
                                                text-sm
                                                transition
                                                ${selectedDifficulty === difficulty ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"
                                                }
                                            `}
                                            >
                                                {getDifficultyLabel(difficulty)}
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Sort */}
                    <div className="relative min-w-[170px]">
                        <button type="button" onClick={() => toggleDropdown("sort")}
                            className="
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-lg
                                border
                                border-[#223A59]
                                bg-[#101C30]
                                px-3
                                py-2.5
                                text-left
                                text-sm
                                text-[#B9C8DC]
                                outline-none
                                transition
                                hover:border-[#00E8C2]/60
                                focus:border-[#00E8C2]
                            "
                        >
                            <span className="truncate">
                                {selectedSortName}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`
                                    shrink-0
                                    text-[#5C7394]
                                    transition-transform
                                    ${openDropdown === "sort" ? "rotate-180" : ""}
                                `}
                            />
                        </button>

                        {openDropdown === "sort" && (
                            <div
                                className="
                                    absolute
                                    left-0
                                    top-full
                                    z-50
                                    mt-2
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#223A59]
                                    bg-[#0E1B2D]
                                    p-1.5
                                    shadow-2xl
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSortChange(
                                            "default",
                                        );
                                        setOpenDropdown(
                                            null,
                                        );
                                    }}
                                    className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        transition
                                        ${
                                        sortBy === "default" ? "bg-[#00E8C2]/10 text-[#00E8C2]"
                                            : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"
                                    }
                                    `}
                                >
                                    Default Order
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onSortChange(
                                            "difficulty-asc",
                                        );
                                        setOpenDropdown(
                                            null,
                                        );
                                    }}
                                    className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        transition
                                        ${sortBy === "difficulty-asc" ? "bg-[#00E8C2]/10 text-[#00E8C2]" : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"}
                                    `}>
                                    Easy → Hard
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onSortChange("difficulty-desc",);
                                        setOpenDropdown(null);
                                    }}
                                    className={`
                                        w-full
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        transition
                                        ${sortBy === "difficulty-desc" ? "bg-[#00E8C2]/10 text-[#00E8C2]"
                                            : "text-[#B9C8DC] hover:bg-[#14243C] hover:text-white"}
                                    `}>
                                    Hard → Easy
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Clear */}
                    {hasFilters && (
                        <button type="button"
                            onClick={() => {
                                onClear();
                                setOpenDropdown(null);
                            }}
                            className="inline-flex items-center justify-center
                                gap-2 rounded-lg border border-[#223A59]
                                px-4 py-2.5 text-sm font-medium text-[#B9C8DC] transition hover:bg-[#101C30]
                                hover:text-white">
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