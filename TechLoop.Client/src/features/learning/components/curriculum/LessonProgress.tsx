interface LessonProgressProps {
    completed: number;
    total: number;
}

export default function LessonProgress({
                                           completed,
                                           total,
                                       }: LessonProgressProps) {
    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) *
                100
            );

    return (
        <div className="p-6">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                    Progress
                </span>

                <span className="text-sm text-[#17D4C3]">
                    {percentage}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-[#17D4C3] transition-all duration-300"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>

            <p className="mt-3 text-xs text-slate-500">
                {completed} of {total} lessons
                completed
            </p>
        </div>
    );
}