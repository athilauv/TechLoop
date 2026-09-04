import { useQuery } from "@tanstack/react-query";
import {
    getDifficultyLevels,
    getExampleTypes,
    getQuestionTypes,
} from "../api/lookup.api.ts";

export const useDifficultyLevels = () => {
    return useQuery({
        queryKey: ["lookups", "difficulty-levels"],
        queryFn: getDifficultyLevels,
        staleTime: 10 * 60 * 1000,
    });
};

export const useQuestionTypes = () => {
    return useQuery({
        queryKey: ["lookups", "question-types"],
        queryFn: getQuestionTypes,
        staleTime: 10 * 60 * 1000,
    });
};

export const useExampleTypes = () => {
    return useQuery({
        queryKey: ["lookups", "example-types"],
        queryFn: getExampleTypes,
        staleTime: 10 * 60 * 1000,
    });
};
