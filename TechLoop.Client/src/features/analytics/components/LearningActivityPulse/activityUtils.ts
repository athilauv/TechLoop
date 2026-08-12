import type { DailyActivity } from "../../../../types/analytics.types";

export type ActivityLevel =
    | "none"
    | "low"
    | "medium"
    | "high";

export function getActivityLevel(
    activity: DailyActivity,
): ActivityLevel {
    if (activity.totalActivities <= 0) {
        return "none";
    }

    if (activity.totalActivities <= 2) {
        return "low";
    }

    if (activity.totalActivities <= 5) {
        return "medium";
    }

    return "high";
}

export function formatMinutes(
    minutes: number,
): string {
    if (minutes <= 0) {
        return "0m";
    }

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
}

export function formatShortDate(
    date: string,
): string {
    return new Date(date).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
        },
    );
}

export function getDateRange(
    data: DailyActivity[] = [],
): string[] {
    if (data.length === 0) {
        return [];
    }

    const sortedDates = data
        .map((item) => item.date)
        .sort();

    const start = new Date(sortedDates[0]);
    const end = new Date(
        sortedDates[sortedDates.length - 1],
    );

    const dates: string[] = [];

    const current = new Date(start);

    while (current <= end) {
        dates.push(
            current.toISOString().slice(0, 10),
        );

        current.setDate(
            current.getDate() + 1,
        );
    }

    return dates;
}
export function getActivitySummary(
    data: DailyActivity[],
) {
    return {
        totalActivities: data.reduce(
            (sum, item) =>
                sum + item.totalActivities,
            0,
        ),

        totalMinutes: data.reduce(
            (sum, item) =>
                sum + item.timeSpentMinutes,
            0,
        ),

        activeDays: data.filter(
            (item) =>
                item.totalActivities > 0 ||
                item.timeSpentMinutes > 0,
        ).length,
    };
}