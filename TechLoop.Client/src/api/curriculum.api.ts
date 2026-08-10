import api from "./axios.ts";
import type { LearnerCurriculum } from "../types/curriculum.types.ts";

export const getCurriculum = async (
    technologyId: number
): Promise<LearnerCurriculum> => {
    const { data } = await api.get<LearnerCurriculum>(
        `/curriculum/learner/${technologyId}`
    );

    return data;
};