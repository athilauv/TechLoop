import type { AnalyticsResponse } from "../types/analytics.types.ts";

const API_URL = "http://localhost:5264/api/analytics";

export async function getAnalytics(): Promise<AnalyticsResponse> {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    const text = await response.text();

    if (!response.ok) {
        let message = "Failed to load analytics";

        if (text) {
            try {
                const result = JSON.parse(text);

                message =
                    result?.message ||
                    result?.Message ||
                    message;
            } catch {
                message = text;
            }
        }

        throw new Error(message);
    }

    if (!text.trim()) {
        throw new Error("Analytics API returned an empty response.");
    }

    try {
        return JSON.parse(text) as AnalyticsResponse;
    } catch {
        throw new Error(
            "Analytics API returned an invalid response."
        );
    }
}