import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createCommunityPost,
    deleteCommunityPost,
    likeCommunityPost,
    saveCommunityPost,
    unlikeCommunityPost,
    unsaveCommunityPost,
    updateCommunityPost
} from "../api/mentorCommunity.api.ts";
import type {
    CommunityRole,
    CreatePostRequest,
    UpdatePostRequest,
} from "../types/community.types";
import { communityQueryKeys } from "./queryKeys";
import { showToast } from "../utils/toast.tsx";
import { getErrorMessage } from "../utils/error.utils.ts";


export function usePostMutations(role: CommunityRole) {
    const queryClient = useQueryClient();

    function invalidateFeed() {
        void queryClient.invalidateQueries({ queryKey: communityQueryKeys.feed(role) });
        void queryClient.invalidateQueries({ queryKey: communityQueryKeys.savedPosts(role) });
    }

    const likeMutation = useMutation({
        mutationFn: (postId: number) => likeCommunityPost(role, postId),
        onSuccess: (_data, postId) => {
            queryClient.setQueryData(communityQueryKeys.likeStatus(role, postId), true);
            invalidateFeed();
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to like the post.")),
    });

    const unlikeMutation = useMutation({
        mutationFn: (postId: number) => unlikeCommunityPost(role, postId),
        onSuccess: (_data, postId) => {
            queryClient.setQueryData(communityQueryKeys.likeStatus(role, postId), false);
            invalidateFeed();
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to unlike the post.")),
    });

    const saveMutation = useMutation({
        mutationFn: (postId: number) => saveCommunityPost(role, postId),
        onSuccess: () => {
            invalidateFeed();
            showToast.success("Post saved successfully.");
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to save the post.")),
    });

    const unsaveMutation = useMutation({
        mutationFn: (postId: number) => unsaveCommunityPost(role, postId),
        onSuccess: () => {
            invalidateFeed();
            showToast.success("Post removed from saved posts.");
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to unsave the post.")),
    });

    const createMutation = useMutation({
        mutationFn: (request: CreatePostRequest) => createCommunityPost(role, request),
        onSuccess: () => {
            invalidateFeed();
            showToast.success("Post created successfully.");
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to create the post.")),
    });

    const updateMutation = useMutation({
        mutationFn: ({ postId, request }: { postId: number; request: UpdatePostRequest }) =>
            updateCommunityPost(role, postId, request),
        onSuccess: (_data, { postId }) => {
            invalidateFeed();
            void queryClient.invalidateQueries({ queryKey: communityQueryKeys.post(role, postId) });
            showToast.success("Post updated successfully.");
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to update the post.")),
    });

    const deleteMutation = useMutation({
        mutationFn: (postId: number) => deleteCommunityPost(role, postId),
        onSuccess: () => {
            invalidateFeed();
            showToast.success("Post deleted successfully.");
        },
        onError: (err) => showToast.error(getErrorMessage(err, "Unable to delete the post.")),
    });

    async function toggleLike(postId: number, currentlyLiked: boolean) {
        if (currentlyLiked) {
            await unlikeMutation.mutateAsync(postId);
        } else {
            await likeMutation.mutateAsync(postId);
        }
    }

    async function toggleSave(postId: number, currentlySaved: boolean) {
        if (currentlySaved) {
            await unsaveMutation.mutateAsync(postId);
        } else {
            await saveMutation.mutateAsync(postId);
        }
    }

    return {
        toggleLike,
        toggleSave,
        createPost: createMutation.mutateAsync,
        updatePost: (postId: number, request: UpdatePostRequest) =>
            updateMutation.mutateAsync({ postId, request }),
        deletePost: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
