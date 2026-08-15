import { DifficultyLevel } from "./enums/difficulty-level.ts";
import { QuestionType } from "./enums/question-type.ts";

export interface LearnerQuestion {
    id: number;
    subTopicId: number;
    questionType: QuestionType;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    mark: number;
    hint: string;
    explanation: string;
    timeLimitSeconds: number | null;
    memoryLimitMb: number | null;
    difficulty: DifficultyLevel;
    position: number;
}

export interface LearnerCodingQuestion {
    id: number;
    subTopicId: number;
    technologyId: number;
    technologyName: string;
    subTopicName: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    marks: number;
    difficulty: DifficultyLevel;
    position: number;
}

export interface LearnerMcqOption {
    id: number;
    optionText: string;
    position: number;
}

export interface LearnerCodingTemplate {
    id: number;
    technologyId: number;
    starterCode: string;
}

export interface LearnerTestCase {
    id: number;
    input: string;
    expectedOutput: string;
    position: number;
}

export interface LearnerMcqQuestion {
    id: number;
    subTopicId: number;
    slug: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    mark: number;
    difficulty: DifficultyLevel;
    position: number;
    options: LearnerMcqOption[];
}

export interface SubmitMcqAnswerRequest {
    questionId: number;
    technologyId: number;
    selectedOptionId: number;
}

export interface SubmitMcqAnswerResponse {
    submissionId: number;
    isCorrect: boolean;
    score: number;
    message: string;
}