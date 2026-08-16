import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCodingQuestions } from "../../../hooks/useQuestion.ts";
import { useTechnologies } from "../../../hooks/useTechnology.ts";

import type { LearnerCodingQuestion } from "../../../types/question.types.ts";

import { DifficultyLevel } from "../../../types/enums/difficulty-level.ts";

import CodingQuestionFilters, {
    type DifficultyFilter,
    type SortOption,
} from "../components/CodingQuestionFilters.tsx";

import Pagination from "../../../shared/components/common/data-display/Pagination.tsx";

const PAGE_SIZE = 10;

const CodingQuestionsPage = () => {
    const navigate = useNavigate();

    /* -----------------------------
       Filter State
    ----------------------------- */

    const [search, setSearch] = useState("");

    const [selectedTechnology, setSelectedTechnology] =
        useState<number | null>(null);

    const [selectedDifficulty, setSelectedDifficulty] =
        useState<DifficultyFilter>("all");

    const [sortBy, setSortBy] =
        useState<SortOption>("default");

    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: technologies = [],
    } = useTechnologies();

    const programmingLanguages = technologies.filter(
        (technology) => technology.categoryId === 1
    );


    const {
        data: questions = [],
        isLoading,
        isError,
    } = useCodingQuestions(
        currentPage,
        PAGE_SIZE,
        selectedTechnology ?? undefined,
        selectedDifficulty === "all" ? undefined : Number(selectedDifficulty),
        undefined,
        search.trim() || undefined,
        sortBy === "default" ? undefined : sortBy === "difficulty-asc" ? "difficulty_asc" : "difficulty_desc"
    );

    const getDifficultyLabel = (difficulty: DifficultyLevel) => {
        const label = DifficultyLevel[difficulty];
        return typeof label === "string" ? label : String(difficulty);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleTechnologyChange = (value: number | null) => {
        setSelectedTechnology(value);
        setCurrentPage(1);
    };

    const handleDifficultyChange = (value: DifficultyFilter) => {
        setSelectedDifficulty(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedTechnology(null);
        setSelectedDifficulty("all");
        setSortBy("default");
        setCurrentPage(1);
    };

    const handleQuestionClick = (
        question: LearnerCodingQuestion
    ) => {
        navigate(`/learner/coding-questions/${question.id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-full">
                <div className="mb-6">
                    <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="mb-6 h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(
                        (item) => (
                            <div key={item} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"/>
                        )
                    )}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Coding Problems
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Practice coding problems and
                        improve your problem-solving
                        skills.
                    </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    Unable to load coding problems.
                    Please try again.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Coding Problems
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Practice coding problems and improve
                    your problem-solving skills.
                </p>
            </div>
            <CodingQuestionFilters
                search={search}
                selectedDifficulty={selectedDifficulty}
                selectedTechnology={selectedTechnology}
                sortBy={sortBy}
                technologies={programmingLanguages}
                onSearchChange={handleSearchChange}
                onDifficultyChange={handleDifficultyChange}
                onTechnologyChange={handleTechnologyChange}
                onSortChange={handleSortChange}
                onClear={handleClearFilters}
            />
            {questions.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-md">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            No coding problems found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Try changing your search or
                            filters.
                        </p>

                        <button type="button" onClick={handleClearFilters}
                            className="mt-5 rounded-lg bg-[#17D4C3] px-4 py-2 text-sm font-medium text-[#081423] transition hover:brightness-105">
                            Clear filters
                        </button>

                    </div>
                </div>
            )}

            {questions.length > 0 && (
                <>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                        {questions.map((question, index) => {
                                const questionNumber = (currentPage - 1) * PAGE_SIZE + index + 1;
                                const difficultyLabel = getDifficultyLabel(question.difficulty);
                                const difficultyClass = difficultyLabel.toLowerCase() === "easy"
                                        ? "text-emerald-600 dark:text-emerald-400" : difficultyLabel.toLowerCase() ===
                                        "medium" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

                                return (
                                    <button key={question.id} type="button"
                                        onClick={() => handleQuestionClick(question)}
                                        className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">

                                        {/* Number */}

                                        <span className="w-8 shrink-0 text-sm text-slate-400">
                                            {questionNumber}
                                        </span>

                                        {/* Question */}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-slate-900 transition group-hover:text-[#17D4C3] dark:text-white">
                                                {question.title}
                                            </h3>

                                            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                                {question.description}
                                            </p>

                                        </div>

                                        {/* Technology */}

                                        <span className="hidden shrink-0 text-xs text-slate-400 lg:block">
                                            {question.technologyName}
                                        </span>

                                        {/* Difficulty */}

                                        <span className={`hidden shrink-0 text-sm font-medium sm:block ${difficultyClass}`}>
                                            {difficultyLabel}
                                        </span>

                                        {/* Marks */}

                                        <span className="hidden w-16 shrink-0 text-right text-xs text-slate-400 md:block">
                                            {question.marks}{" "}
                                            marks
                                        </span>

                                        {/* Arrow */}

                                        <svg viewBox="0 0 24 24"
                                            className="h-[18px] w-[18px] shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#17D4C3]"
                                            fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>

                                    </button>
                                );
                            }
                        )}

                    </div>

                    {questions.length > 0 && (
                        <div className="mt-8 flex flex-col items-center gap-3">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing{" "}
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {(currentPage - 1) * PAGE_SIZE + 1}
                                </span>

                                {" - "}

                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {(currentPage - 1) * PAGE_SIZE + questions.length}
                                </span>{" "}
                                problems
                            </p>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={questions.length === PAGE_SIZE ? currentPage + 1 : currentPage}
                                onPageChange={setCurrentPage}
                                siblingCount={1}/>

                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default CodingQuestionsPage;