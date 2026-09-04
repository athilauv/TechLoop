import api from "./axios.ts";
import type {
    CreateSubmissionRequest,
    CreateSubmissionResponse,
    Submission,
    SubmitMcqAnswerRequest,
    SubmitMcqAnswerResponse
} from "../types/submission.types.ts";

export const createSubmission = async (request: CreateSubmissionRequest): Promise<CreateSubmissionResponse> => {
    const { data } = await api.post<CreateSubmissionResponse>("/api/submissions", request);
    return data;
};

export const submitMcqAnswer = async (request: SubmitMcqAnswerRequest): Promise<SubmitMcqAnswerResponse> => {
    const { data } = await api.post<SubmitMcqAnswerResponse>("/api/submissions/mcq", request);
    return data;
};

export const getSubmissionById = async (submissionId: number): Promise<Submission> => {
    const { data } = await api.get<Submission>(`/api/submissions/${submissionId}`);
    return data;
};

export const getQuestionSubmissions = async (questionId: number): Promise<Submission[]> => {
    const { data } = await api.get<Submission[]>(`/api/submissions/question/${questionId}`);
    return data;
};

export const getMySubmissions = async (): Promise<Submission[]> => {
    const { data } = await api.get<Submission[]>("/api/submissions/me");
    return data;
};