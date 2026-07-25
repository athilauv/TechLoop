import type { TechnologyCategory } from "../../../types/technologyCategory.ts";

interface CategoryTabsProps {
    categories: TechnologyCategory[];
    selectedCategory: number | null;
    onCategoryChange: (id: number) => void;
}

export default function CategoryTabs({
                                         categories,
                                         selectedCategory,
                                         onCategoryChange,
                                     }: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
                const active = category.id === selectedCategory;

                return (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                            active
                                ? "bg-cyan-500 text-white"
                                : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500 hover:text-white"
                        }`}
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
}