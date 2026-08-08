import { useMemo, useState } from "react";
import { LearningHeader } from "../components/LearningHeader";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import TechGrid from "../components/TechGrid";
import TechGridSkeleton from "../components/TechGridSkeleton";
import EmptyState from "../../../shared/components/common/feedback/EmptyState";
import { useTechnologyCategories } from "../hooks/useTechnologyCategories.ts";
import { useTechnologies } from "../hooks/useTechnology.ts";

export default function TechnologyCategoryPage() {
    const [search, setSearch] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] =
        useState<number | null>(null);

    const {
        data: technologies = [],
        isLoading: technologiesLoading,
        isError: technologiesError,
    } = useTechnologies();

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useTechnologyCategories();

    const activeCategoryId =
        selectedCategoryId ?? categories[0]?.id ?? null;

    const selectedCategory = useMemo(() => {
        if (activeCategoryId === null) {
            return null;
        }

        return (
            categories.find(
                (category) => category.id === activeCategoryId
            ) ?? null
        );
    }, [categories, activeCategoryId]);

    const filteredTechnologies = useMemo(() => {
        let filtered = [...technologies];

        if (activeCategoryId !== null) {
            filtered = filtered.filter(
                (technology) =>
                    technology.categoryId === activeCategoryId
            );
        }

        const keyword = search.trim().toLowerCase();

        if (keyword) {
            filtered = filtered.filter(
                (technology) =>
                    technology.name
                        .toLowerCase()
                        .includes(keyword) ||
                    technology.description
                        ?.toLowerCase()
                        .includes(keyword)
            );
        }

        return filtered;
    }, [
        technologies,
        activeCategoryId,
        search,
    ]);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        setSearch("");
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-8 py-8">

            {/* Header */}
            {categoriesLoading ? (
                <div className="mb-8 flex animate-pulse items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-800" />

                    <div className="space-y-2">
                        <div className="h-7 w-48 rounded bg-slate-800" />
                        <div className="h-4 w-72 rounded bg-slate-800" />
                    </div>
                </div>
            ) : (
                <LearningHeader
                    category={selectedCategory}
                />
            )}

            {/* Search */}
            <div className="sticky top-0 z-10 -mx-8 mt-8 bg-[#0B1120]/80 px-8 py-4 backdrop-blur-md">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            {/* Category Tabs */}
            <div className="mt-6">
                <CategoryTabs
                    categories={categories}
                    selectedCategory={activeCategoryId}
                    onCategoryChange={handleCategoryChange}
                    isLoading={categoriesLoading}
                />
            </div>

            {/* Category API error */}
            {categoriesError ? (
                <div className="mt-6">
                    <EmptyState
                        title="Unable to load technology categories"
                        description="We couldn't load the technology categories. Please refresh the page and try again."
                    />
                </div>
            ) : null}

            {/* Technologies */}
            <div className="mt-10">
                {technologiesLoading ? (
                    <TechGridSkeleton />
                ) : technologiesError ? (
                    <EmptyState
                        title="Unable to load technologies"
                        description="We couldn't load the technologies. Please refresh the page and try again."
                    />
                ) : filteredTechnologies.length === 0 ? (
                    search.trim() ? (
                        <EmptyState
                            title="No technologies found"
                            description={`Nothing matches "${search}" in this category. Try a different keyword.`}
                            actionLabel="Clear Search"
                            onAction={() => setSearch("")}
                        />
                    ) : (
                        <EmptyState
                            title="No technologies available"
                            description={
                                selectedCategory
                                    ? `No technologies are available in ${selectedCategory.name} yet.`
                                    : "No technologies are available yet."
                            }
                        />
                    )
                ) : (
                    <TechGrid
                        technologies={filteredTechnologies}
                    />
                )}
            </div>
        </div>
    );
}