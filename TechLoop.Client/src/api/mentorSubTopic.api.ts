import api from "./axios.ts";
import type {
    CreateSubTopicRequest,
    MentorSubTopic,
    UpdateSubTopicRequest,
} from "../types/subTopic.types.ts";
import type {OperationResponse} from "../types/common.types.ts";

export const getMentorSubTopics = async (
    topicId?: number
): Promise<MentorSubTopic[]> => {
    const url = topicId ? `/mentor/subtopics?topicId=${topicId}` : "/mentor/subtopics";
    const { data } = await api.get<MentorSubTopic[]>(url);
    return data;
};

export const createSubTopic = async (
    request: CreateSubTopicRequest
): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>(
        "/mentor/subtopics",
        request
    );

    return data;
};

export const updateSubTopic = async (
    id: number,
    request: UpdateSubTopicRequest
): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(
        `/mentor/subtopics/${id}`,
        request
    );

    return data;
};

export const deleteSubTopic = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.delete<OperationResponse>(
        `/mentor/subtopics/${id}`
    );

    return data;
};

export const publishSubTopic = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(
        `/mentor/subtopics/${id}/publish`
    );

    return data;
};

export const getMentorSubTopicById = async (id: number): Promise<MentorSubTopic> => {
    const { data } = await api.get<MentorSubTopic>(`/mentor/subtopics/${id}`);
    return data;
};
