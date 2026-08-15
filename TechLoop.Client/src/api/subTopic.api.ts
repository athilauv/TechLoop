import api from "./axios.ts";

export interface LearnerSubTopic {
    id: number;
    topicId: number;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    position: number;
    example: string | null;
    exampleType: number | string | null;
    exampleLanguage: string | null;
}

export const getSubTopicBySlug = async (
    slug: string
): Promise<LearnerSubTopic> => {
    const { data } = await api.get<LearnerSubTopic>(
        `/subtopics/${encodeURIComponent(slug)}`
    );

    return data;
};