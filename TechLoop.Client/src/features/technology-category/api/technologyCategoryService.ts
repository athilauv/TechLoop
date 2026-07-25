import axios from "../api/axios";
import type { TechnologyCategory } from "../types/technologyCategory";

class TechnologyCategoryService {
    async getAll(): Promise<TechnologyCategory[]> {
        const response = await axios.get<TechnologyCategory[]>("/technology-categories");
        return response.data;
    }

    async getById(id: number): Promise<TechnologyCategory> {
        const response = await axios.get<TechnologyCategory>(`/technology-categories/${id}`);
        return response.data;
    }
}

export default new TechnologyCategoryService();