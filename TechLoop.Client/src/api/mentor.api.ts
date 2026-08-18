import api from "./axios.ts";
import type {MentorCurriculum} from "../types/mentor.types.ts";

export const getMentorCurriculum = async (): Promise<MentorCurriculum> => {
    const { data } = await api.get<MentorCurriculum>("/mentor/curriculum");
    return data;
};

export const getUnpublishedTopics = async () => {
    const { data } = await api.get("/mentor/unpublished-topics");
    return data;
};

export const getUnpublishedSubTopics = async () => {
    const { data } = await api.get("/mentor/unpublished-subtopics");
    return data;
};

export const getMentorProfile = async () => {
    const { data } = await api.get("/mentor/profile");
    return data;
};

export const getMentorDiscussions = async () => {
    const { data } = await api.get("/mentor/discussions");
    return data;
};

export const getMentorDiscussionById = async (id: number) => {
    const { data } = await api.get(`/mentor/discussions/${id}`);
    return data;
};

export const pinDiscussion = async (id: number) => {
    const { data } = await api.patch(`/mentor/discussions/${id}/pin`);
    return data;
};

export const unpinDiscussion = async (id: number) => {
    const { data } = await api.patch(`/mentor/discussions/${id}/unpin`);
    return data;
};

export const getPendingContributions = async () => {
    const { data } = await api.get("/mentor/pending-contribution");
    return data;
};

export const getTechnologyContributions = async (technologyId: number) => {
    const { data } = await api.get(`/mentor/technology/${technologyId}`);
    return data;
};

export const getMentorContributionById = async (id: number) => {
    const { data } = await api.get(`/mentor/mentor/topic-contributions/${id}`);
    return data;
};