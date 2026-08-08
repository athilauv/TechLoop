import React from "react";
import { Sparkles } from "lucide-react";
import type { TechnologyCategory } from "../types/technologyCategory";

interface LearningHeaderProps {
    category: TechnologyCategory | null;
    onBack?: () => void;
}

export const LearningHeader: React.FC<LearningHeaderProps> = ({
                                                                  category,
                                                                  onBack,
                                                              }) => {
    if (!category) {
        return null;
    }

    return (
        <div className="mb-8">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-4 flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                    ← Back to categories
                </button>
            )}

            <div className="flex items-center gap-4">
                {/* Category Image */}
                {category.imageUrl && (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800">
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-full w-full object-contain"
                        />
                    </div>
                )}

                {/* Category Details */}
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                        {category.name}

                        <Sparkles className="h-6 w-6 text-[#00E5C0]" />
                    </h1>

                    {category.description && (
                        <p className="mt-1 text-text-secondary">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};