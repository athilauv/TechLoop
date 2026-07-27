import axios from "../../../api/axios";
import type { SubTopic } from "../types/SubTopic";

export const getAllSubTopics = async (): Promise<SubTopic[]> => {
    const response = await axios.get<SubTopic[]>("/subtopics");
    return response.data;
};

export const getSubTopicBySlug = async (slug: string): Promise<SubTopic> => {
    const response = await axios.get<SubTopic>(`/subtopics/${slug}`);
    return response.data;
};