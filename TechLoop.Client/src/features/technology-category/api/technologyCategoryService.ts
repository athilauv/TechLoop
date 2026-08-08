import api from "../../../api/axios.ts";
import type { TechnologyCategory } from '../types/technologyCategory';

export const technologyCategoryService = {
    getCategories: async (): Promise<TechnologyCategory[]> => {
        const response = await api.get('/technology-categories');
        return response.data;
    },

    getCategoryById: async (id: number): Promise<TechnologyCategory> => {
        const response = await api.get(`/technology-categories/${id}`);
        return response.data;
    },
};