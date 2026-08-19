import api from "./axios.ts";

import type {
    CommunityPost,
    CreateCommentRequest,
    CreatePostRequest,
    PostComment, SavedPost,
    UpdateCommentRequest,
    UpdatePostRequest,
} from "../types/community.types.ts";

// POSTS

export const getMentorCommunityFeed = async (): Promise<CommunityPost[]> => {
    const { data } = await api.get<CommunityPost[]>(
        "/mentor/community/posts"
    );

    return data;
};

export const getMentorCommunityPost = async (
    postId: number
): Promise<CommunityPost> => {
    const { data } = await api.get<CommunityPost>(
        `/mentor/community/posts/${postId}`
    );

    return data;
};

export const createMentorPost = async (
    request: CreatePostRequest
): Promise<CommunityPost> => {
    const { data } = await api.post<CommunityPost>(
        "/mentor/community/posts",
        request
    );

    return data;
};

export const updateMentorPost = async (
    postId: number,
    request: UpdatePostRequest
): Promise<CommunityPost> => {
    const { data } = await api.put<CommunityPost>(
        `/mentor/community/posts/${postId}`,
        request
    );

    return data;
};

export const deleteMentorPost = async (
    postId: number
): Promise<void> => {
    await api.delete(
        `/mentor/community/posts/${postId}`
    );
};

// COMMENTS

export const getMentorPostComments = async (
    postId: number
): Promise<PostComment[]> => {
    const { data } = await api.get<PostComment[]>(
        `/mentor/community/posts/${postId}/comments`
    );

    return data;
};

export const createMentorComment = async (
    postId: number,
    request: CreateCommentRequest
): Promise<PostComment> => {
    const { data } = await api.post<PostComment>(
        `/mentor/community/posts/${postId}/comments`,
        request
    );

    return data;
};

export const updateMentorComment = async (
    commentId: number,
    request: UpdateCommentRequest
): Promise<PostComment> => {
    const { data } = await api.put<PostComment>(
        `/mentor/community/comments/${commentId}`,
        request
    );

    return data;
};

export const deleteMentorComment = async (
    commentId: number
): Promise<void> => {
    await api.delete(
        `/mentor/community/comments/${commentId}`
    );
};

// LIKES

export const likeMentorPost = async (
    postId: number
): Promise<number> => {
    const { data } = await api.post<number>(
        `/mentor/community/posts/${postId}/likes`
    );

    return data;
};

export const unlikeMentorPost = async (
    postId: number
): Promise<void> => {
    await api.delete(
        `/mentor/community/posts/${postId}/likes`
    );
};

export const getMentorLikeStatus = async (
    postId: number
): Promise<boolean> => {
    const { data } = await api.get<boolean>(
        `/mentor/community/posts/${postId}/likes/me`
    );

    return data;
};

// SAVED POSTS

export const saveMentorPost = async (
    postId: number
): Promise<number> => {
    const { data } = await api.post<number>(
        `/mentor/community/posts/${postId}/save`
    );

    return data;
};

export const unsaveMentorPost = async (
    postId: number
): Promise<void> => {
    await api.delete(
        `/mentor/community/posts/${postId}/save`
    );
};

export const getMentorSavedPosts = async (): Promise<SavedPost[]> => {
    const { data } = await api.get<SavedPost[]>(
        "/mentor/community/saved-posts"
    );

    return data;
};