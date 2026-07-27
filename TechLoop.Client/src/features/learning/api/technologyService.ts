import axios from "../../../api/axios";
import type { Technology } from "../types/Technology";

export const getAllTechnologies = async (): Promise<Technology[]> => {
    const response = await axios.get<Technology[]>("/technologies");
    return response.data;
};

export const getTechnologyBySlug = async (slug: string): Promise<Technology> => {
    const response = await axios.get<Technology>(`/technologies/${slug}`);
    return response.data;
};