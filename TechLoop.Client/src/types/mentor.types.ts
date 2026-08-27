import type { MentorTopic } from "./topic.types.ts";
import type { MentorSubTopic } from "./subTopic.types.ts";

export interface MentorProfileData {
    mentorId: number;
    userId: string;
    username: string;
    email: string;
    phoneNumber?: string | null;
    bio?: string | null;
    linkedInUrl?: string | null;
    githubUrl?: string | null;
    profileImageUrl?: string | null;
    technologyId: number;
    technologyName: string;
}

export interface UpdateMentorProfileRequest {
    phoneNumber?: string | null;
    bio?: string | null;
    linkedInUrl?: string | null;
    githubUrl?: string | null;
    profileImageUrl?: string | null;
}

export interface MentorAdminResponse {
    id: number;
    userId: string;
    username: string;
    email: string;
    technologyId: number;
    technologyName: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface MentorCurriculum {
    technologyId: number;
    technologyName: string;
    topics: MentorCurriculumTopic[];
}

export interface MentorCurriculumTopic extends MentorTopic {
    subTopics: MentorCurriculumSubTopic[];
}

export interface MentorCurriculumSubTopic extends MentorSubTopic {}