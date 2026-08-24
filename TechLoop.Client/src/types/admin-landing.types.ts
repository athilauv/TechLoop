export interface PlatformStats {
    technologiesCount: number;
    topicsCount: number;
    questionsCount: number;
    publishedContentCount: number;
    activeDiscussionsCount: number;
    usersCount: number;
}

export interface RecentActivityItem {
    id: string | number;
    type: "technology" | "content" | "question" | "discussion";
    title: string;
    actorName?: string;
    createdAt: string;
}
