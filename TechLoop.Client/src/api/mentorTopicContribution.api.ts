import api from "./axios.ts";
import type { ReviewTopicContributionRequest, TopicContributionPendingResponse, TopicContributionResponse } from "../types/topicContribution.types.ts";


export const getPendingTopicContributions = async (): Promise<
    TopicContributionPendingResponse[]> => {
    const { data } = await api.get<TopicContributionPendingResponse[]>("/mentor/topic-contributions/pending");
    return data;
};

export const getMentorTopicContributionById = async (id: number): Promise<TopicContributionResponse> => {
    const { data } = await api.get<TopicContributionResponse>(`/mentor/topic-contributions/${id}`);
    return data;
};

export const reviewTopicContribution = async (
    contributionId: number, request: ReviewTopicContributionRequest): Promise<void> => {
    await api.put(`/mentor/topic-contributions/${contributionId}/review`, request);
};
