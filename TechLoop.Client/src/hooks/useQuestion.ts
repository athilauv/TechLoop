import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
    pageSize: number,
    technologyId?: number,
    difficulty?: number,
    subTopicId?: number,
    search?: string,
    sort?: string
) => {
    return useInfiniteQuery({
        queryKey: [
            "coding-questions",
            pageSize,
            technologyId,
            difficulty,
            subTopicId,
            search,
            sort,
        ],
        queryFn: ({ pageParam }) =>
            getCodingQuestions(
                pageParam,
                pageSize,
                technologyId,
                difficulty,
                subTopicId,
                search,
                sort
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === pageSize
                ? allPages.length + 1
                : undefined,
    });
};
