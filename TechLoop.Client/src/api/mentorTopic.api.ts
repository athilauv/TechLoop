import api from "./axios.ts";

import type {
    CreateTopicRequest,
    MentorTopic,
    UpdateTopicRequest,
} from "../types/topic.types.ts";
import type {OperationResponse} from "../types/common.types.ts";

export const getMentorTopics = async (): Promise<MentorTopic[]> => {
    const { data } = await api.get<MentorTopic[]>(
        "/mentor/topics"
    );

    return data;
};

export const getMentorTopicById = async (
    id: number
): Promise<MentorTopic> => {
    const { data } = await api.get<MentorTopic>(
        `/mentor/topics/${id}`
    );

    return data;
};

export const createTopic = async (
    request: CreateTopicRequest
): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>(
        "/mentor/topics",
        request
    );

    return data;
};

export const updateTopic = async (
    id: number,
    request: UpdateTopicRequest
): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(
        `/mentor/topics/${id}`,
        request
    );

    return data;
};

export const deleteTopic = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.delete<OperationResponse>(
        `/mentor/topics/${id}`
    );

    return data;
};

export const publishTopic = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(
        `/mentor/topics/${id}/publish`
    );

    return data;
};
