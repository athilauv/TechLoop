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