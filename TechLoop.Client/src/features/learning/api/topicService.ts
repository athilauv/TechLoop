import axios from "../../../api/axios";
import type { Topic } from "../types/Topic";

export const getAllTopics = async (): Promise<Topic[]> => {
    const response = await axios.get<Topic[]>("/topics");
    return response.data;
};

export const getTopicBySlug = async (
    slug: string
): Promise<Topic> => {
    const response = await axios.get<Topic>(`/topics/${slug}`);
    return response.data;
};