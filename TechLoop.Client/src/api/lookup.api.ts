import api from "./axios.ts";
import type { LookupOption } from "../types/lookup.types.ts";

export const getDifficultyLevels = async (): Promise<LookupOption[]> => {
    const response = await api.get<LookupOption[]>("/lookups/difficulty-levels");
    return response.data;
};

export const getQuestionTypes = async (): Promise<LookupOption[]> => {
    const response = await api.get<LookupOption[]>("/lookups/question-types");
    return response.data;
};

export const getExampleTypes = async (): Promise<LookupOption[]> => {
    const response = await api.get<LookupOption[]>("/lookups/example-types");
    return response.data;
};
