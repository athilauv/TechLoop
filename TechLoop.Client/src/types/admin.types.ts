export interface AdminDashboardResponse {
    usersCount: number;
    mentorsCount: number;
    technologyCategoriesCount: number;
    technologiesCount: number;
    topicsCount: number;
    subTopicsCount: number;
    questionsCount: number;
    publishedQuestionsCount: number;
    activeDiscussionsCount: number;
    communityPostsCount: number;
    pendingContributionsCount: number;
}

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    roleId: number;
    role: string;
    isLocked: boolean;
    lockedUntil: string | null;
    lastLoginAt: string | null;
    createdAt: string;
}

export interface AdminMentorOverview {
    mentorId: number;
    userId: string;
    username: string;
    email: string;
    technologyId: number;
    technologyName: string;
    topicsCount: number;
    subTopicsCount: number;
    questionsCount: number;
    publishedQuestionsCount: number;
    createdAt: string;
}

export interface AdminPendingContribution {
    id: number;
    learnerId: string;
    technologyId: number;
    topicId: number | null;
    subTopicId: number | null;
    title: string;
    description: string;
    example: string | null;
    referenceUrl: string | null;
    exampleType: number | null;
    status: number;
    createdAt: string;
    contributionType: string;
}

export interface AdminTechnologyCategory {
    id: number;
    name: string;
    publishAt: string | null;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    deletedBy: string | null;
    deletedAt: string | null;
}

export interface AdminQuestionResponse {
    id: number;
    subTopicId: number;
    questionType: number;
    slug: string;
    title: string;
    difficulty: number;
    mark: number;
    position: number;
    publishedAt: string | null;
    createdAt: string;
}

export interface AdminCommunityPost {
    id: number;
    userId: string;
    userName: string;
    technologyId: number | null;
    technologyName: string | null;
    title: string;
    content: string;
    isPinned: boolean;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}
