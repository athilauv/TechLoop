import api from "../../../api/axios.ts";
import type { LearnerSubTopic } from "../types/subTopic.types.ts";

export const getSubTopicBySlug = async (
    slug: string
): Promise<LearnerSubTopic> => {
    const { data } = await api.get<LearnerSubTopic>(
        `/subtopics/${slug}`
    );

    return data;
};