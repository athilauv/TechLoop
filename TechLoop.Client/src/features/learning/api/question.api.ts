import api from "../../../api/axios.ts";
import type {
    LearnerCodingTemplate,
    LearnerMcqOption,
    LearnerQuestion,
    LearnerTestCase
} from "../types/question.types.ts";

export const getQuestions = async (): Promise<LearnerQuestion[]> => {
    const { data } = await api.get<LearnerQuestion[]>("/questions");

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
): Promise<LearnerQuestion> => {
    const { data } = await api.get<LearnerQuestion>(
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