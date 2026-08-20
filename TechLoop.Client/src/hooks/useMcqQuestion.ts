import {
    useMutation,
    useQuery,
} from "@tanstack/react-query";

import {
    getCodingQuestions,
    getCodingTemplates,
    getMcqOptions,
    getMcqQuestionBySubTopic,
    getQuestionById,
    getQuestionDetails,
    getQuestions,
    getTestCases,
    submitMcqAnswer,
} from "../api/question.api.ts";

export const useQuestions = () => {
    return useQuery({
        queryKey: ["questions"],
        queryFn: getQuestions,
    });
};

export const useQuestion = (
    questionId: number,
) => {
    return useQuery({
        queryKey: [
            "question",
            questionId,
        ],
        queryFn: () =>
            getQuestionById(
                questionId,
            ),
        enabled:
            Number.isInteger(
                questionId,
            ) &&
            questionId > 0,
    });
};

export const useQuestionDetails = (
    questionId: number,
) => {
    return useQuery({
        queryKey: [
            "question-details",
            questionId,
        ],
        queryFn: () =>
            getQuestionDetails(
                questionId,
            ),
        enabled:
            Number.isInteger(
                questionId,
            ) &&
            questionId > 0,
    });
};

export const useMcqQuestion = (
    subTopicId: number,
) => {
    return useQuery({
        queryKey: [
            "mcq-question",
            subTopicId,
        ],
        queryFn: () =>
            getMcqQuestionBySubTopic(
                subTopicId,
            ),
        enabled:
            Number.isInteger(
                subTopicId,
            ) &&
            subTopicId > 0,
    });
};

export const useMcqOptions = (
    questionId: number,
) => {
    return useQuery({
        queryKey: [
            "mcq-options",
            questionId,
        ],
        queryFn: () =>
            getMcqOptions(
                questionId,
            ),
        enabled:
            Number.isInteger(
                questionId,
            ) &&
            questionId > 0,
    });
};

export const useSubmitMcqAnswer =
    () => {
        return useMutation({
            mutationFn:
            submitMcqAnswer,
        });
    };

export const useCodingTemplates = (
    questionId: number,
) => {
    return useQuery({
        queryKey: [
            "coding-templates",
            questionId,
        ],
        queryFn: () =>
            getCodingTemplates(
                questionId,
            ),
        enabled:
            Number.isInteger(
                questionId,
            ) &&
            questionId > 0,
    });
};

export const useTestCases = (
    questionId: number,
) => {
    return useQuery({
        queryKey: [
            "test-cases",
            questionId,
        ],
        queryFn: () =>
            getTestCases(
                questionId,
            ),
        enabled:
            Number.isInteger(
                questionId,
            ) &&
            questionId > 0,
    });
};

export const useCodingQuestions = (
    page: number,
    pageSize: number,
    technologyId?: number,
    difficulty?: number,
    subTopicId?: number,
    search?: string,
    sort?: string,
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
                sort,
            ),
    });
};