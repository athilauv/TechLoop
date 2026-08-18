import api from "./axios.ts";

import type {
    CreateTechnologyRequest,
    MentorTechnology,
    UpdateTechnologyRequest,
} from "../types/technology.types.ts";
import type {OperationResponse} from "../types/common.types.ts";

export const getMentorTechnologies = async (): Promise<MentorTechnology[]> => {
    const { data } = await api.get<MentorTechnology[]>(
        "/mentor/technologies"
    );

    return data;
};

export const getMentorTechnologyById = async (
    id: number
): Promise<MentorTechnology> => {
    const { data } = await api.get<MentorTechnology>(
        `/mentor/technologies/${id}`
    );

    return data;
};

export const createTechnology = async (
    request: CreateTechnologyRequest
): Promise<OperationResponse> => {
    const { data } = await api.post<OperationResponse>(
        "/mentor/technologies",
        request
    );

    return data;
};

export const updateTechnology = async (
    id: number,
    request: UpdateTechnologyRequest
): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(
        `/mentor/technologies/${id}`,
        request
    );

    return data;
};

export const deleteTechnology = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.delete<OperationResponse>(
        `/mentor/technologies/${id}`
    );

    return data;
};

export const publishTechnology = async (
    id: number
): Promise<OperationResponse> => {
    const { data } = await api.patch<OperationResponse>(
        `/mentor/technologies/${id}/publish`
    );

    return data;
};