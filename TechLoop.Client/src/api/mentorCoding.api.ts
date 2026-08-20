import api from "./axios.ts";
import type { OperationResponse } from "../types/common.types.ts";
import type {
    CreateCodingTemplateRequest,
    CreateTestCaseRequest,
    MentorCodingTemplate,
    MentorTestCase,
    UpdateCodingTemplateRequest,
    UpdateTestCaseRequest,
} from "../types/question.types.ts";

export const getCodingTemplatesByQuestion = async (
    questionId: number,
): Promise<MentorCodingTemplate[]> => {
    const response = await api.get<MentorCodingTemplate[]>(
        `/mentor/questions/${questionId}/coding-templates`,
    );

    return response.data;
};

export const createCodingTemplate = async (
    questionId: number,
    request: CreateCodingTemplateRequest,
): Promise<OperationResponse> => {
    const response = await api.post<OperationResponse>(
        `/mentor/questions/${questionId}/coding-templates`,
        request,
    );

    return response.data;
};

export const updateCodingTemplate = async (
    id: number,
    request: UpdateCodingTemplateRequest,
): Promise<OperationResponse> => {
    const response = await api.put<OperationResponse>(
        `/mentor/coding-templates/${id}`,
        request,
    );

    return response.data;
};

export const deleteCodingTemplate = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.delete<OperationResponse>(
        `/mentor/coding-templates/${id}`,
    );

    return response.data;
};

export const getTestCasesByQuestion = async (
    questionId: number,
): Promise<MentorTestCase[]> => {
    const response = await api.get<MentorTestCase[]>(
        `/mentor/questions/${questionId}/test-cases`,
    );

    return response.data;
};

export const createTestCase = async (
    questionId: number,
    request: CreateTestCaseRequest,
): Promise<OperationResponse> => {
    const response = await api.post<OperationResponse>(
        `/mentor/questions/${questionId}/test-cases`,
        request,
    );

    return response.data;
};

export const updateTestCase = async (
    id: number,
    request: UpdateTestCaseRequest,
): Promise<OperationResponse> => {
    const response = await api.put<OperationResponse>(
        `/mentor/test-cases/${id}`,
        request,
    );

    return response.data;
};

export const deleteTestCase = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.delete<OperationResponse>(
        `/mentor/test-cases/${id}`,
    );

    return response.data;
};