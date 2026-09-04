import api from "./axios.ts";
import type { DashboardResponse } from "../types/dashboard.types.ts";

export const getDashboard = async (): Promise<DashboardResponse> => {
    const { data } = await api.get<DashboardResponse>("/api/analytics");
    return data;
};