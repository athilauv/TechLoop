import api from "./axios.ts";

import type {
    LearnerCodingQuestion,
    LearnerCodingTemplate,
    LearnerMcqOption, LearnerMcqQuestion,
    LearnerQuestion,
    LearnerTestCase,
    QuestionDetails,
} from "../types/question.types.ts";

export const getQuestions = async (): Promise<
    LearnerQuestion[]
> => {
    const { data } =
        await api.get<LearnerQuestion[]>(
            "/questions",
        );

    return data;
};

export const getQuestionById = async (
    questionId: number,
): Promise<LearnerQuestion> => {
    const { data } = await api.get<LearnerQuestion>(
        `/questions/${questionId}`,
    );

    return data;
};

export const getQuestionBySlug = async (
    slug: string,
): Promise<LearnerQuestion> => {
    const { data } = await api.get<LearnerQuestion>(
        `/questions/slug/${encodeURIComponent(slug)}`,
    );

    return data;
};

export const getQuestionDetails = async (
    questionId: number,
): Promise<QuestionDetails> => {
    const { data } = await api.get<QuestionDetails>(
        `/questions/${questionId}/details`,
    );

    return data;
};

export const getQuestionDetailsBySlug = async (
    slug: string,
): Promise<QuestionDetails> => {
    const { data } = await api.get<QuestionDetails>(
        `/questions/slug/${encodeURIComponent(slug)}/details`,
    );

    return data;
};

export const getMcqOptions = async (
    questionId: number,
): Promise<LearnerMcqOption[]> => {
    const { data } =
        await api.get<LearnerMcqOption[]>(
            `/questions/${questionId}/mcq-options`,
        );

    return data;
};


export const getCodingTemplates = async (
    questionId: number,
): Promise<LearnerCodingTemplate[]> => {
    const { data } =
        await api.get<LearnerCodingTemplate[]>(
            `/questions/${questionId}/coding-templates`,
        );

    return data;
};

export const getTestCases = async (
    questionId: number,
): Promise<LearnerTestCase[]> => {
    const { data } =
        await api.get<LearnerTestCase[]>(
            `/questions/${questionId}/test-cases`,
        );

    return data;
};

export const getCodingQuestions = async (
    page: number,
    pageSize: number,
    technologyId?: number,
    difficulty?: number,
    subTopicId?: number,
    search?: string,
    sort?: string,
): Promise<LearnerCodingQuestion[]> => {
    const params = new URLSearchParams();

    params.append(
        "page",
        String(page),
    );

    params.append(
        "pageSize",
        String(pageSize),
    );

    if (
        technologyId !==
        undefined
    ) {
        params.append(
            "technologyId",
            String(technologyId),
        );
    }

    if (
        difficulty !==
        undefined
    ) {
        params.append(
            "difficulty",
            String(difficulty),
        );
    }

    if (
        subTopicId !==
        undefined
    ) {
        params.append(
            "subTopicId",
            String(subTopicId),
        );
    }

    if (search?.trim()) {
        params.append(
            "search",
            search.trim(),
        );
    }

    if (sort?.trim()) {
        params.append(
            "sort",
            sort.trim(),
        );
    }

    const { data } =
        await api.get<LearnerCodingQuestion[]>(
            `/questions/coding?${params.toString()}`,
        );

    return data;
};

export const getMcqQuestionBySubTopic = async (
    subTopicId: number,
): Promise<LearnerMcqQuestion[]> => {
    const { data } =
        await api.get<LearnerMcqQuestion[]>(
            `/questions/sub-topic/${subTopicId}/mcq`,
        );

    return data;
};
