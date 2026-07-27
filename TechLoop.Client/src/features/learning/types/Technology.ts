export interface Technology {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}