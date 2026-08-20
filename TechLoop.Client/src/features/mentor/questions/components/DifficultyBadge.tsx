import { CircleDot } from "lucide-react";
import { DifficultyLevel, type DifficultyLevel as DifficultyLevelType } from "../../../../types/enums/difficulty-level.ts";

interface DifficultyBadgeProps {
    difficulty: DifficultyLevelType;
}

const DIFFICULTY_CONFIG: Record<
    DifficultyLevelType,
    {
        label: string;
        className: string;
    }
> = {
    [DifficultyLevel.Beginner]: {
        label: "Beginner",
        className: "border-sky-400/20 bg-sky-400/10 text-sky-400",
    },
    [DifficultyLevel.Easy]: {
        label: "Easy",
        className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    },
    [DifficultyLevel.Medium]: {
        label: "Medium",
        className: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    },
    [DifficultyLevel.Hard]: {
        label: "Hard",
        className: "border-orange-400/20 bg-orange-400/10 text-orange-400",
    },
    [DifficultyLevel.Expert]: {
        label: "Expert",
        className: "border-red-400/20 bg-red-400/10 text-red-400",
    },
};

const DifficultyBadge = ({
                             difficulty,
                         }: DifficultyBadgeProps) => {
    const config = DIFFICULTY_CONFIG[difficulty];

    if (!config) {
        return null;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
        >
            <CircleDot className="h-3 w-3" />
            {config.label}
        </span>
    );
};

export default DifficultyBadge;