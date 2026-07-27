export interface Topic {
    id: number;
    technologyId: number;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;

}