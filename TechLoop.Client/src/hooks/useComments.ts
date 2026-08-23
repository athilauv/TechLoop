import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPostComment,
    deletePostComment,
    getPostComments,
    updatePostComment
} from "../api/mentorCommunity.api.ts";
import type { CommunityRole } from "../types/community.types";
import type { PostComment } from "../types/community.types";
import { communityQueryKeys } from "./queryKeys.tsx";
import { getErrorMessage} from "../utils/error.utils.ts";

export function useComments(role: CommunityRole, postId: number) {
    const queryClient = useQueryClient();

    const {
        data: comments = [],
        isLoading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey: communityQueryKeys.comments(role, postId),
        queryFn: () => getPostComments(role, postId),
        enabled: postId > 0,
    });

    function invalidate() {
        void queryClient.invalidateQueries({ queryKey: communityQueryKeys.comments(role, postId) });
    }

    async function addComment(content: string, parentCommentId: number | null = null) {
        const trimmed = content.trim();
        if (!trimmed) {
            throw new Error(parentCommentId ? "Reply cannot be empty." : "Comment cannot be empty.");
        }

        try {
            await createPostComment(role, postId, { content: trimmed, parentCommentId });
            invalidate();
        } catch (err) {
            throw new Error(
                getErrorMessage(err, parentCommentId ? "Unable to add reply." : "Unable to add comment.")
            );
        }
    }

    async function editComment(comment: PostComment, newContent: string) {
        const trimmed = newContent.trim();
        if (!trimmed) {
            throw new Error("Comment cannot be empty.");
        }

        try {
            await updatePostComment(role, comment.id, { content: trimmed });
            invalidate();
        } catch (err) {
            throw new Error(getErrorMessage(err, "Unable to update comment."));
        }
    }

    async function removeComment(commentId: number) {
        try {
            await deletePostComment(role, commentId);
            invalidate();
        } catch (err) {
            throw new Error(getErrorMessage(err, "Unable to delete comment."));
        }
    }

    return {
        comments,
        isLoading,
        error: queryError ? getErrorMessage(queryError, "Failed to load comments.") : null,
        addComment,
        editComment,
        removeComment,
        refetch,
    };
}
