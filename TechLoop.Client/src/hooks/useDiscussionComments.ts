import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DiscussionComment } from "../types/discussion.types.ts";

interface UseDiscussionCommentsOptions {
    discussionId: number;
    enabled: boolean;
    fetchComments: (discussionId: number) => Promise<DiscussionComment[]>;
}

export const useDiscussionComments = ({
                                          discussionId,
                                          enabled,
                                          fetchComments,
                                      }: UseDiscussionCommentsOptions) => {
    const queryClient = useQueryClient();

    const query = useQuery<DiscussionComment[]>({
        queryKey: ["discussion-comments", discussionId],
        queryFn: () => fetchComments(discussionId),
        enabled: enabled && discussionId > 0,
    });

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: ["discussion-comments", discussionId],
        });

    return {
        comments: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        invalidate,
    };
};
