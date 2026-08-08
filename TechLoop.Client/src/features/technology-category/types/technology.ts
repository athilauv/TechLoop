export interface Technology {
    id: number;
    categoryId: number;
    name: string;
    slug: string;
    description: string;
    imageUrl?: string | null;
    position: number;
    publishedAt?: string | null;
    publishedBy?: string | null;
    createdAt: string;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
}