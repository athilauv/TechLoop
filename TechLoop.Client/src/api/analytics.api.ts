import api from "./axios.ts";
import type { AnalyticsResponse } from "../types/analytics.types.ts";

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
    const { data } = await api.get<AnalyticsResponse>(
        "/api/analytics"
    );

    return data;
};