import type { CommunityTechnology } from "../../../../../types/community.types.ts";

interface TechnologyFilterProps {
    technologies: CommunityTechnology[];
    selectedTechnologyId: number | null;
    onTechnologyChange: (technologyId: number | null) => void;
    loading?: boolean;
}


export default function TechnologyFilter({
                                             technologies,
                                             selectedTechnologyId,
                                             onTechnologyChange,
                                             loading = false,
                                         }: TechnologyFilterProps) {
    if (loading) {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-[#0f1e35]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
                type="button"
                onClick={() => onTechnologyChange(null)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                    selectedTechnologyId === null
                        ? "border-[#17D4C3] bg-[#0a2638] text-[#17D4C3]"
                        : "border-[#1e3254] bg-[#0f1e35] text-[#7189a8] hover:border-[#24506a] hover:text-white"
                }`}
            >
                All discussions
            </button>

            {technologies.map((technology) => (
                <button
                    key={technology.id}
                    type="button"
                    onClick={() => onTechnologyChange(technology.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${
                        selectedTechnologyId === technology.id
                            ? "border-[#17D4C3] bg-[#0a2638] text-[#17D4C3]"
                            : "border-[#1e3254] bg-[#0f1e35] text-[#7189a8] hover:border-[#24506a] hover:text-white"
                    }`}
                >
                    {technology.name}
                </button>
            ))}
        </div>
    );
}
