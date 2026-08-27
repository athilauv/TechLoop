import { useQuery } from "@tanstack/react-query";
import { getMentorPendingQueue } from "../api/mentorPending.api.ts";

export const MENTOR_PENDING_QUERY_KEY = ["mentor-pending"];

export const useMentorPendingQueue = () => {
    return useQuery({
        queryKey: MENTOR_PENDING_QUERY_KEY,
        queryFn: getMentorPendingQueue,
        staleTime: 30_000,
    });
};
