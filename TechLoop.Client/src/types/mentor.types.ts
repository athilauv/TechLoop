export interface MentorCurriculumSubTopic {
    id: number;
    topicId: number;
    parentSubTopicId: number | null;
    title: string;
    slug: string;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface MentorCurriculumTopic {
    id: number;
    title: string;
    slug: string;
    position: number;
    createdAt: string;
    updatedAt: string | null;
    subTopics: MentorCurriculumSubTopic[];
}

export interface MentorCurriculum {
    technologyId: number;
    technologyName: string;
    topics: MentorCurriculumTopic[];
}

export interface MentorProfileData {
    username: string;
    email: string;
    technologyId: number;
    technologyName: string;
    phoneNumber: string | null;
    bio: string | null;
    linkedInUrl: string | null;
    githubUrl: string | null;
    profileImageUrl: string | null;
}

export interface UpdateMentorProfileRequest {
    phoneNumber: string;
    bio: string;
    linkedInUrl: string;
    githubUrl: string;
    profileImageUrl: string;
}