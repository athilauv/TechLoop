import { useEffect, useMemo, useState } from "react";
import LearningHeader from "../components/LearningHeader.tsx";
import SearchBar from "../components/SearchBar.tsx";
import CategoryTabs from "../components/CategoryTabs.tsx";
import TechGrid from "../components/TechGrid.tsx";
import type { Technology } from "../types/technology.ts";
import { LoaderBar } from "../../../shared/components/common/feedback/Loader.tsx";
import EmptyState from "../../../shared/components/common/feedback/EmptyState.tsx";
import type { TechnologyCategory } from "../types/technologyCategory.ts";
import technologyService from "../api/technologyService.ts";
import technologyCategoryService from "../api/technologyCategoryService.ts";

export default function TechnologyCategory() {
    const [categories, setCategories] = useState<TechnologyCategory[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        void loadData();
    }, []);

    async function loadData() {
        setLoading(true);

        try {
            const technologiesData = await technologyService.getAll();

            console.log("Technologies Response:", technologiesData);
            console.log("Is Technologies Array:", Array.isArray(technologiesData));

            if (Array.isArray(technologiesData)) {
                setTechnologies(technologiesData);
            } else {
                console.error("Expected technologies array but received:", technologiesData);
                setTechnologies([]);
            }

            const categoriesData = await technologyCategoryService.getAll();

            console.log("Categories Response:", categoriesData);
            console.log("Is Categories Array:", Array.isArray(categoriesData));

            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);

                if (categoriesData.length > 0) {
                    setSelectedCategory(categoriesData[0].id);
                }
            } else {
                console.error("Expected categories array but received:", categoriesData);
                setCategories([]);
            }
        } catch (error) {
            console.error("Failed to load data.", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTechnologies = useMemo(() => {
        if (!Array.isArray(technologies)) {
            return [];
        }

        return technologies.filter((technology) =>
            technology.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [technologies, search]);

    return (
        <div className="mx-auto w-full max-w-7xl px-8 py-8">
            <LearningHeader />

            <div className="mt-8">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                />
            </div>

            <div className="mt-6">
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
            </div>

            <div className="mt-10 flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    All Technologies
                </h2>

                <span className="text-xs text-slate-500">
                    {filteredTechnologies.length} Technologies
                </span>
            </div>

            <div className="mt-8">
                {loading && <LoaderBar />}

                {!loading && filteredTechnologies.length === 0 && (
                    <EmptyState title="No Technologies" description="No technologies found."/>
                )}

                {!loading && filteredTechnologies.length > 0 && (
                    <TechGrid technologies={filteredTechnologies} />
                )}
            </div>
        </div>
    );
}