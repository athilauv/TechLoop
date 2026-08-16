import api from "./axios";
import type {
    CreateDiscussionCommentRequest,
    CreateDiscussionRequest,
    Discussion,
    DiscussionComment,
    UpdateDiscussionCommentRequest,
    UpdateDiscussionRequest,
} from "../types/discussion.types";

export const getQuestionDiscussions = async (questionId: number): Promise<Discussion[]> => {
    const { data } = await api.get<Discussion[]>(`/api/learner/discussions/question/${questionId}`);
    return data;
};

export const getDiscussion = async (discussionId: number): Promise<Discussion> => {
    const { data } = await api.get<Discussion>(`/api/learner/discussions/${discussionId}`);
    return data;
};

export const createDiscussion = async (request: CreateDiscussionRequest): Promise<Discussion> => {
    const { data } = await api.post<Discussion>("/api/learner/discussions", request);
    return data;
};

export const updateDiscussion = async (request: UpdateDiscussionRequest): Promise<Discussion> => {
    const { data } = await api.put<Discussion>(
        `/api/learner/discussions/${request.id}`,
        {
            id: request.id,
            title: request.title,
            content: request.content,
        }
    );
    return data;
};

export const deleteDiscussion = async (
    discussionId: number): Promise<void> => {
    await api.delete(`/api/learner/discussions/${discussionId}`);
};

export const getDiscussionComments = async (discussionId: number): Promise<DiscussionComment[]> => {
    const { data } = await api.get<DiscussionComment[]>(`/api/learner/discussions/${discussionId}/comments`);
    return data;
};

export const createDiscussionComment = async (
    discussionId: number, request: CreateDiscussionCommentRequest): Promise<DiscussionComment> => {
    const { data } = await api.post<DiscussionComment>(`/api/learner/discussions/${discussionId}/comments`, request);
    return data;
};

export const updateDiscussionComment = async (
    commentId: number, request: UpdateDiscussionCommentRequest): Promise<boolean> => {
    const { data } = await api.put<boolean>(`/api/learner/discussions/comments/${commentId}`, request);
    return data;
};

export const deleteDiscussionComment = async (commentId: number): Promise<void> => {
    await api.delete(`/api/learner/discussions/comments/${commentId}`);
};