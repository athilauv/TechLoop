import api from "./axios";
import type { Discussion } from "../types/discussion.types";
import type { PagedResponse } from "../types/pagination.types";

export const getMentorDiscussions = async (page = 1, pageSize = 20, search?: string, sort = "newest"): Promise<PagedResponse<Discussion>> => {
    const response = await api.get<PagedResponse<Discussion>>("/api/discussions", { params: { page, pageSize, search: search || undefined, sort } });
    return response.data;
};

export const getMentorDiscussionById = async (id: number): Promise<Discussion> => {
    const response = await api.get<Discussion>(`/api/discussions/${id}`,);
    return response.data;
};

export const pinDiscussion = async (id: number,): Promise<boolean> => {
    const response = await api.patch<boolean>(`/mentor/discussions/${id}/pin`,);
    return response.data;
};

export const unpinDiscussion = async (id: number,): Promise<boolean> => {
    const response = await api.patch<boolean>(`/mentor/discussions/${id}/unpin`);
    return response.data;
};