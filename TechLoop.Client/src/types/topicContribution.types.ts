export interface CreateTopicContributionRequest {
    technologyId: number;
    topicId: number | null;
    subTopicId: number | null;
    title: string;
    description: string;
    example: string | null;
    exampleType: number | null;
    referenceUrl: string | null;
}

export interface TopicContributionSummaryResponse {
    id: number;
    technologyName: string;
    topicTitle: string;
    subTopicTitle: string | null;
    status: number;
    createdAt: string;
}

export interface TopicContributionResponse {
    id: number;
    learnerId: string;
    learnerName: string;
    technologyId: number;
    technologyName: string;
    topicId: number | null;
    topicTitle: string | null;
    subTopicId: number | null;
    subTopicTitle: string | null;
    title: string;
    description: string;
    example: string | null;
    exampleType: number | null;
    referenceUrl: string | null;
    status: number;
    reviewNotes: string | null;
    reviewedBy: string | null;
    reviewerName: string | null;
    createdAt: string;
    reviewedAt: string | null;
    updatedAt: string | null;
}

export interface TopicContributionPendingResponse {
    id: number;
    learnerId: string;
    technologyId: number;
    topicId: number | null;
    subTopicId: number | null;
    title: string;
    description: string;
    example: string | null;
    referenceUrl: string | null;
    exampleType: number | null;
    status: number;
    createdAt: string;
    contributionType: string;
}


export interface ReviewTopicContributionRequest {
    status: 2 | 3;
    reviewNotes: string | null;
    position: number | null;
    parentSubTopicId: number | null;
}