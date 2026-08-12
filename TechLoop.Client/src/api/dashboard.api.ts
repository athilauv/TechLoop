import type { DashboardResponse } from "../types/dashboard.types.ts";

const API_URL = "http://localhost:5264/api/analytics";

export async function getDashboard(): Promise<DashboardResponse> {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Failed to load dashboard"
        );
    }

    return result;
}