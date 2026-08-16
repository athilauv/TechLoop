import api from "./axios.ts";

import type {
    CreateTopicContributionRequest,
    ReviewTopicContributionRequest,
    TopicContributionPendingResponse,
    TopicContributionResponse,
    TopicContributionSummaryResponse,
} from "../types/topicContribution.types.ts";

// ======================================================
// LEARNER
// ======================================================

export const createTopicContribution = async (
    request: CreateTopicContributionRequest
): Promise<number> => {
    const { data } = await api.post<number>(
        "/api/topic-contributions",
        request
    );

    return data;
};

export const getMyTopicContributions = async (): Promise<
    TopicContributionSummaryResponse[]
> => {
    const { data } =
        await api.get<TopicContributionSummaryResponse[]>(
            "/api/topic-contributions/my"
        );

    return data;
};

export const getMyTopicContributionById = async (
    id: number
): Promise<TopicContributionResponse> => {
    const { data } =
        await api.get<TopicContributionResponse>(
            `/api/topic-contributions/my/${id}`
        );

    return data;
};

// ======================================================
// MENTOR
// ======================================================

export const getPendingTopicContributions = async (): Promise<
    TopicContributionPendingResponse[]
> => {
    const { data } =
        await api.get<TopicContributionPendingResponse[]>(
            "/api/mentor/topic-contributions/pending"
        );

    return data;
};

export const getMentorTopicContributionById = async (
    id: number
): Promise<TopicContributionResponse> => {
    const { data } =
        await api.get<TopicContributionResponse>(
            `/api/mentor/topic-contributions/${id}`
        );

    return data;
};

// ======================================================
// REVIEW
// ======================================================

export const reviewTopicContribution = async (
    contributionId: number,
    request: ReviewTopicContributionRequest
): Promise<void> => {
    await api.put(
        `/api/mentor/topic-contributions/${contributionId}/review`,
        request
    );
};