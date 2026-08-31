import api from "./axios.ts";
import type { OperationResponse } from "../types/common.types.ts";
import type {
    AdminDashboardResponse,
    AdminMentorOverview,
    AdminPendingContribution,
    AdminUser,
    AdminTechnologyCategory,
    AdminQuestionResponse,
    AdminCommunityPost,
} from "../types/admin.types.ts";
import type { MentorTechnology, CreateTechnologyRequest, UpdateTechnologyRequest } from "../types/technology.types.ts";
import type { MentorAdminResponse } from "../types/mentor.types.ts";

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
    const { data } = await api.get<AdminDashboardResponse>("/admin/dashboard");
    return data;
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
    const { data } = await api.get<AdminUser[]>("/admin/users");
    return data;
};

export const updateAdminUserRole = async (userId: string, roleId: number): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(`/admin/users/${userId}/role`, { roleId });
    return data;
};

export const getAdminMentorOverview = async (mentorId: number): Promise<AdminMentorOverview> => {
    const { data } = await api.get<AdminMentorOverview>(`/admin/mentors/${mentorId}/overview`);
    return data;
};

export const getAdminQuestions = async (): Promise<AdminQuestionResponse[]> => {
    const { data } = await api.get<AdminQuestionResponse[]>("/admin/questions");
    return data;
};

export const getAdminCommunity = async (): Promise<AdminCommunityPost[]> => {
    const { data } = await api.get<AdminCommunityPost[]>("/admin/community");
    return data;
};

export const getAdminPendingContributions = async (): Promise<AdminPendingContribution[]> => {
    const { data } = await api.get<AdminPendingContribution[]>("/admin/topic-contributions/pending");
    return data;
};

export const createAdminTechnologyCategory = async (name: string): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>("/admin/technology-categories", { name });
    return data;
};

export const updateAdminTechnologyCategory = async (id: number, name: string): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(`/admin/technology-categories/${id}`, { name });
    return data;
};

export const publishAdminTechnologyCategory = async (id: number): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(`/admin/technology-categories/${id}/publish`);
    return data;
};

export const deleteAdminTechnologyCategory = async (id: number): Promise<OperationResponse> => {
    const { data } = await api.delete<OperationResponse>(`/admin/technology-categories/${id}`);
    return data;
};

export const getAdminTechnologyCategories = async (): Promise<AdminTechnologyCategory[]> => {
    const { data } = await api.get<AdminTechnologyCategory[]>("/admin/technology-categories");
    return data;
};

export const getAdminTechnologies = async (): Promise<MentorTechnology[]> => {
    const { data } = await api.get<MentorTechnology[]>("/admin/technologies");
    return data;
};

// Mentor assignment only needs the technologies available for selection.
// Keep the admin technology-management endpoint separate because it also
// contains draft/publishing state.
export const getMentorAssignmentTechnologies = async (): Promise<MentorTechnology[]> => {
    const { data } = await api.get<MentorTechnology[]>("/technologies");
    return data;
};

export const createAdminTechnology = async (request: CreateTechnologyRequest): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>("/admin/technologies", request);
    return data;
};

export const updateAdminTechnology = async (id: number, request: UpdateTechnologyRequest): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(`/admin/technologies/${id}`, request);
    return data;
};

export const publishAdminTechnology = async (id: number): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(`/admin/technologies/${id}/publish`);
    return data;
};

export const deleteAdminTechnology = async (id: number): Promise<OperationResponse> => {
    const { data } = await api.delete<OperationResponse>(`/admin/technologies/${id}`);
    return data;
};

export const createAdminMentor = async (request: { name: string; email: string; technologyId: number }): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>("/admin/mentors", request);
    return data;
};

export const deleteAdminMentor = async (id: number): Promise<void> => {
    await api.delete(`/admin/mentors/${id}`);
};

export const getAdminMentors = async (): Promise<MentorAdminResponse[]> => {
    const { data } = await api.get<MentorAdminResponse[]>("/admin/mentors");
    return data;
};
