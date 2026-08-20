import api from "./axios.ts";
import type { OperationResponse} from "../types/common.types.ts";
import type { Discussion } from "../types/discussion.types.ts";


export const getMentorDiscussions = async (): Promise<Discussion[]> => {
    const response = await api.get<Discussion[]>("/mentor/discussions",);
    return response.data;
};

export const getMentorDiscussionById = async (
    id: number,): Promise<Discussion> => {
    const response = await api.get<Discussion>(`/mentor/discussions/${id}`,);
    return response.data;
};

export const pinDiscussion = async (
    id: number,
): Promise<OperationResponse> => {
    const response = await api.patch<OperationResponse>(`/mentor/discussions/${id}/pin`,);
    return response.data;
};

export const unpinDiscussion = async (
    id: number,): Promise<OperationResponse> => {
    const response = await api.patch<OperationResponse>(`/mentor/discussions/${id}/unpin`,);
    return response.data;
};