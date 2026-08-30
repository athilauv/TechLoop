import api from "./axios.ts";
import type { OperationResponse } from "../types/common.types.ts";
import type {
    CreateMcqOptionRequest,
    CreateQuestionRequest,
    MentorMcqOption,
    MentorQuestion,
    UpdateMcqOptionRequest,
    UpdateQuestionRequest,
} from "../types/question.types.ts";

export const getMentorQuestions = async (): Promise<
    MentorQuestion[]
> => {
    const response = await api.get<MentorQuestion[]>(
        "/mentor/questions",
    );

    return response.data;
};

export const getMentorQuestionById = async (
    id: number,
): Promise<MentorQuestion> => {
    const response = await api.get<MentorQuestion>(
        `/mentor/questions/${id}`,
    );

    return response.data;
};

export const getMentorQuestionBySlug = async (
    slug: string,
): Promise<MentorQuestion> => {
    const response = await api.get<MentorQuestion>(
        `/mentor/questions/slug/${encodeURIComponent(slug)}`,
    );

    return response.data;
};

export const createQuestion = async (
    request: CreateQuestionRequest,
): Promise<OperationResponse> => {
    const response = await api.post<OperationResponse>(
        "/mentor/questions",
        request,
    );

    return response.data;
};

export const updateQuestion = async (
    id: number,
    request: UpdateQuestionRequest,
): Promise<OperationResponse> => {
    const response = await api.put<OperationResponse>(
        `/mentor/questions/${id}`,
        request,
    );

    return response.data;
};

export const deleteQuestion = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.delete<OperationResponse>(
        `/mentor/questions/${id}`,
    );

    return response.data;
};

export const publishQuestion = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.patch<OperationResponse>(
        `/mentor/questions/${id}/publish`,
    );

    return response.data;
};

export const getMcqOptionsByQuestion = async (
    questionId: number,
): Promise<MentorMcqOption[]> => {
    const response = await api.get<MentorMcqOption[]>(
        `/mentor/questions/${questionId}/mcq-options`,
    );

    return response.data;
};

export const createMcqOption = async (
    questionId: number,
    request: CreateMcqOptionRequest,
): Promise<OperationResponse> => {
    const response = await api.post<OperationResponse>(
        `/mentor/questions/${questionId}/mcq_options`,
        request,
    );

    return response.data;
};

export const updateMcqOption = async (
    id: number,
    request: UpdateMcqOptionRequest,
): Promise<OperationResponse> => {
    const response = await api.put<OperationResponse>(
        `/mentor/mcq-options/${id}`,
        request,
    );

    return response.data;
};

export const deleteMcqOption = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.delete<OperationResponse>(
        `/mentor/mcq-options/${id}`,
    );

    return response.data;
};
