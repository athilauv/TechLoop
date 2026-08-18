import type { ExampleType } from "./enums/example-type.ts";

export interface MentorTopic {
    id: number;
    technologyId: number;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    publishedAt: string | null;
    publishedBy: string | null;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
}

export interface CreateTopicRequest {
    technologyId: number;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    shiftPositions: boolean;
}

export interface UpdateTopicRequest {
    technologyId: number;
    slug: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    shiftPositions: boolean;
}