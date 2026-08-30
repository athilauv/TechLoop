import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getCodingQuestions,
    getCodingTemplates,
    getMcqOptions,
    getQuestionBySlug,
    getQuestionDetailsBySlug,
    getQuestions,
    getTestCases,
} from "../api/question.api.ts";
import { submitMcqAnswer } from "../api/submission.api.ts";

export const useQuestions = () => {
    return useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    });
};

export const useQuestion = (slug: string) => {
    return useQuery({
        queryKey: ["question", slug],
        queryFn: () => getQuestionBySlug(slug),
        enabled: Boolean(slug?.trim()),
    });
};

export const useQuestionDetails = (slug: string) => {
    return useQuery({
        queryKey: ["question-details", slug],
        queryFn: () => getQuestionDetailsBySlug(slug),
        enabled: Boolean(slug?.trim()),
    });
};

export const useMcqOptions = (questionId: number) => {
    return useQuery({
        queryKey: ["mcq-options", questionId],
        queryFn: () => getMcqOptions(questionId),
        enabled: Number.isInteger(questionId) && questionId > 0,
    });
};

export const useSubmitMcqAnswer = () => {
    return useMutation({
        mutationFn: submitMcqAnswer,
    });
};

export const useCodingTemplates = (questionId: number) => {
    return useQuery({
        queryKey: ["coding-templates", questionId],
        queryFn: () => getCodingTemplates(questionId),
        enabled: Number.isInteger(questionId) && questionId > 0,
    });
};

export const useTestCases = (questionId: number) => {
    return useQuery({
        queryKey: ["test-cases", questionId],
        queryFn: () => getTestCases(questionId),
        enabled: Number.isInteger(questionId) && questionId > 0,
    });
};

export const useCodingQuestions = (
    page: number,
    pageSize: number,
    technologyId?: number,
    difficulty?: number,
    subTopicId?: number,
    search?: string,
    sort?: string
) => {
    return useQuery({
        queryKey: [
            "coding-questions",
            page,
            pageSize,
            technologyId,
            difficulty,
            subTopicId,
            search,
            sort,
        ],
        queryFn: () =>
            getCodingQuestions(
                page,
                pageSize,
                technologyId,
                difficulty,
                subTopicId,
                search,
                sort
            ),
    });
};
