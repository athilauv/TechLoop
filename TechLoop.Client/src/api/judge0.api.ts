import api from "./axios.ts";
import type {
    Judge0ResultResponse,
    RunCodeRequest,
    Judge0SubmissionResponse,
} from "../types/judge0.types.ts";

export const submitToJudge0 = async (request: RunCodeRequest): Promise<Judge0SubmissionResponse> => {
    const { data } = await api.post<Judge0SubmissionResponse>("/api/judge0/run", request);
    return data;
};

export const getJudge0Result = async (token: string): Promise<Judge0ResultResponse> => {
    const { data } = await api.get<Judge0ResultResponse>(`/api/judge0/result/${encodeURIComponent(token)}`,);
    return data;
};
