import api from "./axios";
import type { UserProfile } from "../types/profile.types";

export const getLearnerProfile = async (): Promise<UserProfile> => {
    const { data } = await api.get<UserProfile>("/api/learner/profile");
    return data;
};