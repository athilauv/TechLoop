import api from "./axios";
import type {
    CreateDiscussionCommentRequest,
    CreateDiscussionRequest,
    Discussion,
    DiscussionComment,
    UpdateDiscussionCommentRequest,
    UpdateDiscussionRequest,
} from "../types/discussion.types";

export const getQuestionDiscussions = async (
    questionId: number,
): Promise<Discussion[]> => {
    const { data } = await api.get<Discussion[]>(
        `/api/discussions/question/${questionId}`,
    );

    return data;
};

export const getDiscussion = async (
    discussionId: number,
): Promise<Discussion> => {
    const { data } = await api.get<Discussion>(
        `/api/discussions/${discussionId}`,
    );

    return data;
};

export const createDiscussion = async (
    request: CreateDiscussionRequest,
): Promise<Discussion> => {
    const { data } = await api.post<Discussion>(
        "/api/discussions",
        request,
    );

    return data;
};

export const updateDiscussion = async (
    request: UpdateDiscussionRequest,
): Promise<Discussion> => {
    const { data } = await api.put<Discussion>(
        `/api/discussions/${request.id}`,
        {
            id: request.id,
            title: request.title,
            content: request.content,
        },
    );

    return data;
};

export const deleteDiscussion = async (
    discussionId: number,
): Promise<void> => {
    await api.delete(`/api/discussions/${discussionId}`);
};

export const getDiscussionComments = async (
    discussionId: number,
): Promise<DiscussionComment[]> => {
    const { data } = await api.get<DiscussionComment[]>(
        `/api/discussions/${discussionId}/comments`,
    );

    return data;
};

export const createDiscussionComment = async (
    discussionId: number,
    request: CreateDiscussionCommentRequest,
): Promise<DiscussionComment> => {
    const { data } = await api.post<DiscussionComment>(
        `/api/discussions/${discussionId}/comments`,
        request,
    );

    return data;
};

export const updateDiscussionComment = async (
    commentId: number,
    request: UpdateDiscussionCommentRequest,
): Promise<boolean> => {
    const { data } = await api.put<boolean>(
        `/api/discussions/comments/${commentId}`,
        request,
    );

    return data;
};

export const deleteDiscussionComment = async (
    commentId: number,
): Promise<void> => {
    await api.delete(`/api/discussions/comments/${commentId}`);
};