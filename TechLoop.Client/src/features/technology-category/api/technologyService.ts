import axios from "../api/axios";
import type { Technology } from "../types/technology";

class TechnologyService {
    async getAll(): Promise<Technology[]> {
        const response = await axios.get<Technology[]>("/technologies");
        return response.data;
    }

    async getById(id: number): Promise<Technology> {
        const response = await axios.get<Technology>(`/technologies/${id}`);
        return response.data;
    }
}

export default new TechnologyService();