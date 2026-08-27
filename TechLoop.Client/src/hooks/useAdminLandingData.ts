import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/admin.api.ts";
import type { PlatformStats } from "../types/admin-landing.types.ts";

export const useAdminLandingData = () => {
    const query = useQuery({ queryKey: ["admin-dashboard"], queryFn: getAdminDashboard, staleTime: 30_000 });
    const stats: PlatformStats | null = query.data ? {
        technologiesCount: query.data.technologiesCount,
        topicsCount: query.data.topicsCount,
        questionsCount: query.data.questionsCount,
        publishedContentCount: query.data.publishedQuestionsCount,
        activeDiscussionsCount: query.data.activeDiscussionsCount,
        usersCount: query.data.usersCount,
    } : null;
    return { stats, recentActivity: null, isLoading: query.isLoading };
};
