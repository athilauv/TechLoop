import type { DailyActivity } from "../../../../../types/analytics.types";
import {
    formatMinutes,
    formatShortDate,
    getActivityLevel
} from "../../../../../utils/activityUtils.ts";

interface ActivityNodeProps {
    activity: DailyActivity;
    selected: boolean;
    today: boolean;
    onSelect: (activity: DailyActivity) => void;
}

const levelStyles = {
    none: {
        background: "#0b182b",
        border: "#29466d",
        shadow: "none",
    },
    low: {
        background: "#17454b",
        border: "#1b706f",
        shadow: "0 0 8px rgba(23,212,195,0.12)",
    },
    medium: {
        background: "#178f8a",
        border: "#17b9ae",
        shadow: "0 0 12px rgba(23,212,195,0.2)",
    },
    high: {
        background: "#17D4C3",
        border: "#7ff5ec",
        shadow: "0 0 18px rgba(23,212,195,0.35)",
    },
};

export default function ActivityNode({
                                         activity,
                                         selected,
                                         today,
                                         onSelect,
                                     }: ActivityNodeProps) {
    const level = getActivityLevel(activity);
    const styles = levelStyles[level];

    return (
        <button
            type="button"
            onClick={() => onSelect(activity)}
            aria-label={`${formatShortDate(activity.date)}, ${activity.totalActivities} activities, ${formatMinutes(activity.timeSpentMinutes)}`}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#17D4C3]"
        >
            <span
                className="absolute inset-1 rounded-full transition-all"
                style={{
                    background: styles.background,
                    border: `1px solid ${
                        selected
                            ? "#ffffff"
                            : styles.border
                    }`,
                    boxShadow: selected
                        ? "0 0 0 3px rgba(23,212,195,0.25)"
                        : styles.shadow,
                }}
            />

            {today && (
                <span className="absolute inset-0 rounded-full border border-[#17D4C3]/50 animate-pulse" />
            )}

            <span
                className="relative z-10 h-1.5 w-1.5 rounded-full bg-white"
                style={{
                    opacity:
                        level === "none"
                            ? 0.2
                            : 0.9,
                }}
            />

            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-[#29466d] bg-[#081423] px-2 py-1 text-[10px] text-white group-hover:block">
                {formatShortDate(activity.date)}
                {" · "}
                {formatMinutes(
                    activity.timeSpentMinutes,
                )}
            </span>
        </button>
    );
}