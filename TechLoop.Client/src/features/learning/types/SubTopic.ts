export interface SubTopic {
    id: number;
    topicId: number;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}