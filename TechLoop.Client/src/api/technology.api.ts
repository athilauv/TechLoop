import api from "./axios.ts";
import type { LearnerTechnology, LearnerTechnologyCategory } from "../types/technology.types.ts";

export const getTechnologyCategories = async (): Promise<
    LearnerTechnologyCategory[]
> => {
    const { data } = await api.get<LearnerTechnologyCategory[]>(
        "/technology-categories"
    );

    return data;
};

export const getTechnologies = async (): Promise<LearnerTechnology[]> => {
    const { data } = await api.get<LearnerTechnology[]>("/technologies");

    return data;
};

export const getTechnologyBySlug = async (
    slug: string
): Promise<LearnerTechnology> => {
    const { data } = await api.get<LearnerTechnology>(
        `/technologies/${slug}`
    );

    return data;
};