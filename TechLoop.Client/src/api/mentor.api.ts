import api from "./axios.ts";
import type {
    MentorCurriculum,
    MentorProfileData,
    UpdateMentorProfileRequest,
} from "../types/mentor.types.ts";
import type { OperationResponse } from "../types/common.types.ts";

export const getMentorCurriculum = async (): Promise<MentorCurriculum> => {
    const { data } = await api.get<MentorCurriculum>("/mentor/curriculum");
    return data;
};

export const getMentorProfile = async (): Promise<MentorProfileData> => {
    const { data } = await api.get<MentorProfileData>("/mentor/profile");
    return data;
};

export const updateMentorProfile = async (
    request: UpdateMentorProfileRequest,
): Promise<OperationResponse> => {
    const { data } = await api.put<OperationResponse>(
        "/mentor/profile",
        request,
    );

    return data;
};
