import api from "./axios.ts";
import type {
    CommunityPost,
    CreateCommentRequest,
    CreatePostRequest,
    PostComment,
    SavedPost,
    UpdateCommentRequest,
    UpdatePostRequest } from "../types/community.types";

 // POSTS
export const getCommunityFeed = async (): Promise<CommunityPost[]> => {
    const { data } = await api.get<CommunityPost[]>("/api/learner/community/posts");
    return data;
};

export const getCommunityPost = async (postId: number): Promise<CommunityPost> => {
    const { data } = await api.get<CommunityPost>(`/api/learner/community/posts/${postId}`);
    return data;
};

export const createPost = async (data: CreatePostRequest): Promise<CommunityPost> => {
    const response = await api.post<CommunityPost>("/api/learner/community/posts", data);
    return response.data;
};

export const updatePost = async (postId: number, data: UpdatePostRequest): Promise<CommunityPost> => {
    const response = await api.put<CommunityPost>(`/api/learner/community/posts/${postId}`, data);
    return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
    await api.delete(`/api/learner/community/posts/${postId}`);
};

 // COMMENTS
export const getPostComments = async (postId: number): Promise<PostComment[]> => {
    const { data } = await api.get<PostComment[]>(`/api/learner/community/posts/${postId}/comments`);
    return data;
};

export const getComment = async (commentId: number): Promise<PostComment> => {
    const { data } = await api.get<PostComment>(`/api/learner/community/comments/${commentId}`);
    return data;
};

export const createComment = async (postId: number, data: CreateCommentRequest): Promise<PostComment> => {
    const response = await api.post<PostComment>(`/api/learner/community/posts/${postId}/comments`, data);
    return response.data;
};

export const updateComment = async (commentId: number, data: UpdateCommentRequest): Promise<PostComment> => {
    const response = await api.put<PostComment>(`/api/learner/community/comments/${commentId}`, data);
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await api.delete(`/api/learner/community/comments/${commentId}`);
};

 // LIKES
export const likePost = async (postId: number): Promise<number> => {
    const { data } = await api.post<number>(`/api/learner/community/posts/${postId}/likes`);
    return data;
};

export const unlikePost = async (postId: number): Promise<void> => {
    await api.delete(`/api/learner/community/posts/${postId}/likes`);
};

export const getLikeStatus = async (postId: number): Promise<boolean> => {
    const { data } = await api.get<boolean>(`/api/learner/community/posts/${postId}/likes/me`);
    return data;
};

  // SAVED POSTS
export const savePost = async (postId: number): Promise<number> => {
    const { data } = await api.post<number>(`/api/learner/community/posts/${postId}/save`);
    return data;
};

export const unsavePost = async (postId: number): Promise<void> => {
    await api.delete(`/api/learner/community/posts/${postId}/save`);
};

export const getSavedPosts = async (): Promise<SavedPost[]> => {
    const { data } = await api.get<SavedPost[]>("/api/learner/community/saved-posts");
    return data;
};