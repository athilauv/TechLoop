import type { DailyActivity } from "../../../../../types/analytics.types";
import { formatMinutes, formatShortDate } from "./activityUtils";

interface ActivityTooltipProps {
    activity: DailyActivity;
}

export default function ActivityTooltip({
                                            activity,
                                        }: ActivityTooltipProps) {
    return (
        <div className="rounded-xl border border-[#1e3254] bg-[#0a1729] p-4">
            <p className="text-sm font-semibold text-white">
                {formatShortDate(activity.date)}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                    <p className="text-sm font-semibold text-[#17D4C3]">
                        {formatMinutes(
                            activity.timeSpentMinutes,
                        )}
                    </p>

                    <p className="text-[10px] text-[#617b9d]">
                        Time spent
                    </p>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white">
                        {activity.totalActivities}
                    </p>

                    <p className="text-[10px] text-[#617b9d]">
                        Activities
                    </p>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white">
                        {activity.questionsSolved}
                    </p>

                    <p className="text-[10px] text-[#617b9d]">
                        Questions
                    </p>
                </div>

                <div>
                    <p className="text-sm font-semibold text-white">
                        {activity.codingCompleted}
                    </p>

                    <p className="text-[10px] text-[#617b9d]">
                        Coding
                    </p>
                </div>
            </div>
        </div>
    );
}