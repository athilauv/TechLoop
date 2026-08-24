import { useState, useEffect } from "react";
import type { PlatformStats, RecentActivityItem } from "../types/admin-landing.types";

/**
 * ⚠️ PLACEHOLDER — wire this up to your real service layer.
 *
 * Replace the body of this hook with your existing React Query hooks,
 * e.g.:
 *
 *   const { data: technologies } = useQuery(["technologies"], getTechnologies);
 *   const { data: topics } = useQuery(["topics"], getTopics);
 *   const { data: questions } = useQuery(["questions"], getQuestions);
 *   ...then derive `stats` and `recentActivity` from that real data.
 *
 * This placeholder returns `null` for both so the UI renders its
 * loading/empty states instead of fabricating numbers — per the brief,
 * nothing here is invented data.
 */
export const useAdminLandingData = () => {
    const [stats] = useState<PlatformStats | null>(null);
    const [recentActivity] = useState<RecentActivityItem[] | null>(null);
    const [isLoading] = useState(false);

    useEffect(() => {
        // No-op: intentionally left for the integrator to replace.
    }, []);

    return { stats, recentActivity, isLoading };
};
