import type { ExampleType } from "./enums/example-type.ts";

export interface LearnerSubTopic {
    id: number;
    topicId: number;
    parentSubTopicId: number | null;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    example: string | null;
    exampleType: ExampleType | null;
    exampleLanguage?: string | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface MentorSubTopic {
    id: number;
    topicId: number;
    topicTitle: string;
    parentSubTopicId: number | null;
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

export interface CreateSubTopicRequest {
    topicId: number;
    parentSubTopicId: number | null;
    title: string;
    description: string;
    imageUrl?: string | null;
    slug: string;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    shiftPositions: boolean;
}

export interface UpdateSubTopicRequest {
    topicId: number;
    parentSubTopicId: number | null;
    title: string;
    description: string;
    imageUrl?: string | null;
    slug: string;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    shiftPositions: boolean;
}