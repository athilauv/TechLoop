import React from "react";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import type { TechnologyCategory } from "../types/technologyCategory.ts";

interface LearningHeaderProps {
    category: TechnologyCategory | null;
    technologiesCount?: number;
    onBack?: () => void;
}

export const LearningHeader: React.FC<LearningHeaderProps> = ({
                                                                  category,
                                                                  technologiesCount,
                                                                  onBack,
                                                              }) => {
    if (!category) return null;

    return (
        <div className="mb-8 border-b border-[#223A59] pb-8">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-4 flex items-center gap-1.5 text-sm text-[#8CA3BF] transition-colors duration-150 hover:text-white"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to categories
                </button>
            )}

            <div className="flex items-start gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#223A59] bg-[#12233B] text-3xl">
                    {category.icon ?? <BookOpen className="h-7 w-7 text-[#00E8C2]" />}
                </span>

                <div className="min-w-0">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {category.name}
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8CA3BF]">
                        {category.description ??
                            `Explore curated lessons, examples, and hands-on practice for ${category.name}.`}
                    </p>

                    {typeof technologiesCount === "number" && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#5C7394]">
                            <Layers className="h-3.5 w-3.5" />
                            {technologiesCount} {technologiesCount === 1 ? "technology" : "technologies"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};