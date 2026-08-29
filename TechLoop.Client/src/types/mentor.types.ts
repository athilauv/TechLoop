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
export interface MentorCurriculumSubTopic {
    id: number;
    title: string;
    slug: string;
    position: number;
    publishedAt: string | null;
}

export interface MentorCurriculumTopic {
    id: number;
    title: string;
    slug: string;
    position: number;
    publishedAt: string | null;
    subTopics: MentorCurriculumSubTopic[];
}

export interface MentorCurriculum {
    technologyId: number;
    technologyName: string;
    topics: MentorCurriculumTopic[];
}