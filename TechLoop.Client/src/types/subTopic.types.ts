
import { ExampleType } from "./enums/example-type.ts";

export interface LearnerSubTopic {
    id: number;
    topicId: number;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    example: string | null;
    exampleType: ExampleType | null;
    position: number;
    createdAt: string;
    updatedAt: string | null;
}