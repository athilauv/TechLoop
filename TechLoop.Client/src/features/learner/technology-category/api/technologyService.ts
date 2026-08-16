import api from "../../../../api/axios.ts";
import type { Technology } from '../types/technology';

export const technologyService = {
    getTechnologies: async (): Promise<Technology[]> => {
        const response = await api.get('/technologies');
        return response.data;
    },

    getTechnologyBySlug: async (slug: string): Promise<Technology> => {
        const response = await api.get(`/technologies/${slug}`);
        return response.data;
    },
};