export interface LearnerTechnology {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface LearnerTechnologyCategory {
    id: number;
    name: string;
}