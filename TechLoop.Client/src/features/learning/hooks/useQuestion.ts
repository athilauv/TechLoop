import { useQuery } from "@tanstack/react-query";

import {
    getCodingTemplates,
    getMcqOptions,
    getQuestionById,
    getQuestionDetails,
    getQuestions,
    getTestCases,
} from "../api/question.api";

export const useQuestions = () => {
    return useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    });
};

export const useQuestion = (questionId: number) => {
    return useQuery({
        queryKey: ["question", questionId],
        queryFn: () => getQuestionById(questionId),
        enabled: questionId > 0,
    });
};

export const useQuestionDetails = (questionId: number) => {
    return useQuery({
        queryKey: ["question-details", questionId],
        queryFn: () => getQuestionDetails(questionId),
        enabled: questionId > 0,
    });
};

export const useMcqOptions = (questionId: number) => {
    return useQuery({
        queryKey: ["mcq-options", questionId],
        queryFn: () => getMcqOptions(questionId),
        enabled: questionId > 0,
    });
};

export const useCodingTemplates = (questionId: number) => {
    return useQuery({
        queryKey: ["coding-templates", questionId],
        queryFn: () => getCodingTemplates(questionId),
        enabled: questionId > 0,
    });
};

export const useTestCases = (questionId: number) => {
    return useQuery({
        queryKey: ["test-cases", questionId],
        queryFn: () => getTestCases(questionId),
        enabled: questionId > 0,
    });
};