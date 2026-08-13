import api from "./axios.ts";

import type {
    LearnerCodingTemplate,
    LearnerMcqOption,
    LearnerQuestion,
    LearnerTestCase,
    LearnerCodingQuestion,
} from "../types/question.types.ts";

export const getQuestions = async (): Promise<LearnerQuestion[]> => {
    const { data } = await api.get<LearnerQuestion[]>("/questions");

    return data;
};

export const getCodingQuestions = async (
    page: number,
    pageSize: number,
    technologyId?: number,
    difficulty?: number,
    subTopicId?: number,
    search?: string,
    sort?: string
): Promise<LearnerCodingQuestion[]> => {
    const { data } = await api.get<LearnerCodingQuestion[]>(
        "/questions/coding",
        {
            params: {
                page,
                pageSize,
                technologyId,
                difficulty,
                subTopicId,
                search,
                sort,
            },
        }
    );

    return data;
};

export const getQuestionById = async (
    questionId: number
): Promise<LearnerQuestion> => {
    const { data } = await api.get<LearnerQuestion>(
        `/questions/${questionId}`
    );

    return data;
};

export const getQuestionDetails = async (
    questionId: number
) => {
    const { data } = await api.get(
        `/questions/${questionId}/details`
    );

    return data;
};

export const getMcqOptions = async (
    questionId: number
): Promise<LearnerMcqOption[]> => {
    const { data } = await api.get<LearnerMcqOption[]>(
        `/questions/questions/${questionId}/mcq-options`
    );

    return data;
};

export const getCodingTemplates = async (
    questionId: number
): Promise<LearnerCodingTemplate[]> => {
    const { data } = await api.get<LearnerCodingTemplate[]>(
        `/questions/questions/${questionId}/coding-templates`
    );

    return data;
};

export const getTestCases = async (
    questionId: number
): Promise<LearnerTestCase[]> => {
    const { data } = await api.get<LearnerTestCase[]>(
        `/questions/questions/${questionId}/test-cases`
    );

    return data;
};


export interface SubmitMcqAnswerRequest {
    questionId: number;
    technologyId: number;
    selectedOptionId: number;
}

export interface SubmitMcqAnswerResponse {
    submissionId: number;
    isCorrect: boolean;
    score: number;
    message: string;
}

export const submitMcqAnswer = async (
    request: SubmitMcqAnswerRequest
): Promise<SubmitMcqAnswerResponse> => {
    const { data } = await api.post<SubmitMcqAnswerResponse>(
        "/api/submissions/mcq",
        request
    );

    return data;
};