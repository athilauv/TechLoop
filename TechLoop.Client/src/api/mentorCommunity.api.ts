import api from "./axios.ts";
import type {
    CommunityPost,
    CommunityRole,
    CreateCommentRequest,
    CreatePostRequest,
    PostComment,
    SavedPost,
    UpdateCommentRequest,
    UpdatePostRequest,
} from "../types/community.types";

const ROLE_BASE_PATHS: Record<CommunityRole, string> = {
    learner: "/api/learner/community",
    mentor: "/mentor/community",
};

function basePath(role: CommunityRole): string {
    return ROLE_BASE_PATHS[role];
}

//POSTS
export const getCommunityFeed = async (role: CommunityRole): Promise<CommunityPost[]> => {
    const { data } = await api.get<CommunityPost[]>(`${basePath(role)}/posts`);
    return data;
};

export const getCommunityPost = async (
    role: CommunityRole,
    postId: number
): Promise<CommunityPost> => {
    const { data } = await api.get<CommunityPost>(`${basePath(role)}/posts/${postId}`);
    return data;
};

export const createCommunityPost = async (
    role: CommunityRole,
    request: CreatePostRequest
): Promise<CommunityPost> => {
    const { data } = await api.post<CommunityPost>(`${basePath(role)}/posts`, request);
    return data;
};

export const updateCommunityPost = async (
    role: CommunityRole,
    postId: number,
    request: UpdatePostRequest
): Promise<CommunityPost> => {
    const { data } = await api.put<CommunityPost>(`${basePath(role)}/posts/${postId}`, request);
    return data;
};

export const deleteCommunityPost = async (role: CommunityRole, postId: number): Promise<void> => {
    await api.delete(`${basePath(role)}/posts/${postId}`);
};

//COMMENTS
export const getPostComments = async (
    role: CommunityRole,
    postId: number
): Promise<PostComment[]> => {
    const { data } = await api.get<PostComment[]>(`${basePath(role)}/posts/${postId}/comments`);
    return data;
};

export const createPostComment = async (
    role: CommunityRole,
    postId: number,
    request: CreateCommentRequest
): Promise<PostComment> => {
    const { data } = await api.post<PostComment>(
        `${basePath(role)}/posts/${postId}/comments`, request);
    return data;
};

export const updatePostComment = async (
    role: CommunityRole,
    commentId: number,
    request: UpdateCommentRequest
): Promise<PostComment> => {
    const { data } = await api.put<PostComment>(`${basePath(role)}/comments/${commentId}`, request);
    return data;
};

export const deletePostComment = async (role: CommunityRole, commentId: number): Promise<void> => {
    await api.delete(`${basePath(role)}/comments/${commentId}`);
};

//LIKES
export const likeCommunityPost = async (role: CommunityRole, postId: number): Promise<number> => {
    const { data } = await api.post<number>(`${basePath(role)}/posts/${postId}/likes`);
    return data;
};

export const unlikeCommunityPost = async (role: CommunityRole, postId: number): Promise<void> => {
    await api.delete(`${basePath(role)}/posts/${postId}/likes`);
};

export const getPostLikeStatus = async (role: CommunityRole, postId: number): Promise<boolean> => {
    const { data } = await api.get<boolean>(`${basePath(role)}/posts/${postId}/likes/me`);
    return data;
};

//SAVED POSTS
export const saveCommunityPost = async (role: CommunityRole, postId: number): Promise<number> => {
    const { data } = await api.post<number>(`${basePath(role)}/posts/${postId}/save`);
    return data;
};

export const unsaveCommunityPost = async (role: CommunityRole, postId: number): Promise<void> => {
    await api.delete(`${basePath(role)}/posts/${postId}/save`);
};

export const getSavedCommunityPosts = async (role: CommunityRole): Promise<SavedPost[]> => {
    const { data } = await api.get<SavedPost[]>(`${basePath(role)}/saved-posts`);
    return data;
};
