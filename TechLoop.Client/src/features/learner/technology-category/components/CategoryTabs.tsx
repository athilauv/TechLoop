import type { TechnologyCategory } from "../types/technologyCategory";

interface CategoryTabsProps {
    categories: TechnologyCategory[];
    selectedCategory: number | null;
    onCategoryChange: (id: number) => void;
    isLoading?: boolean;
}

export default function CategoryTabs({
                                         categories,
                                         selectedCategory,
                                         onCategoryChange,
                                         isLoading = false,
                                     }: CategoryTabsProps) {
    if (isLoading) {
        return (
            <div className="flex flex-wrap justify-center gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-10 w-24 animate-pulse rounded-full bg-slate-800"
                    />
                ))}
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
                const active = category.id === selectedCategory;

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onCategoryChange(category.id)}
                        className={`
                            relative rounded-full px-5 py-2.5
                            text-sm font-medium
                            transition-all duration-300
                            ${
                            active
                                ? "bg-[#00E5C0] text-[#0B1120] shadow-lg shadow-[#00E5C0]/30"
                                : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-[#00E5C0] hover:text-white hover:shadow-md hover:shadow-[#00E5C0]/10"
                        }
                        `}
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
}