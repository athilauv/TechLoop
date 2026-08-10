export interface LearnerCurriculum {
    technologyId: number;
    technologyName: string;
    topics: CurriculumTopic[];
}

export interface CurriculumTopic {
    id: number;
    title: string;
    slug: string;
    position: number;
    createdAt: string;
    updatedAt: string | null;
    subTopics: CurriculumSubTopic[];
}

export interface CurriculumSubTopic {
    id: number;
    topicId: number;
    parentSubTopicId: number | null;
    title: string;
    slug: string;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}