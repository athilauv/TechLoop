export interface LearnerTechnology {
    id: number;
    categoryId: number;
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

export interface MentorTechnology {
    id: number;
    categoryId: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    position: number;
    publishedAt: string | null;
    publishedBy: string | null;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
}

export interface CreateTechnologyRequest {
    categoryId: number;
    name: string;
    description?: string | null;
    slug?: string | null;
    imageUrl?: string | null;
    position: number;
}

export interface UpdateTechnologyRequest {
    categoryId: number;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    position: number;
}
