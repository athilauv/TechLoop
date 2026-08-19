import api from "./axios.ts";
import type { CreateTopicContributionRequest, TopicContributionResponse, TopicContributionSummaryResponse } from "../types/topicContribution.types.ts";

export const createTopicContribution = async (
    request: CreateTopicContributionRequest
): Promise<number> => {
    const { data } = await api.post<number>("/api/topic-contributions", request);
    return data;
};

export const getMyTopicContributions = async (): Promise<
    TopicContributionSummaryResponse[]
> => {
    const { data } = await api.get<TopicContributionSummaryResponse[]>("/api/topic-contributions/my");
    return data;
};

export const getMyTopicContributionById = async (
    id: number
): Promise<TopicContributionResponse> => {
    const { data } = await api.get<TopicContributionResponse>(`/api/topic-contributions/my/${id}`);
    return data;
};
