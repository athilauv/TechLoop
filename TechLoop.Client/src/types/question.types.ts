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

export interface QuestionDetails {
    id: number;
    subTopicId: number | null;
    questionType: QuestionType;
    title: string;
    slug: string | null;
    description: string | null;
    imageUrl: string | null;
    mark: number;
    hint: string | null;
    explanation: string | null;
    timeLimitSeconds: number | null;
    memoryLimitMb: number | null;
    difficulty: DifficultyLevel;
    position: number;
    options: LearnerMcqOption[] | null;
    codingTemplate: LearnerCodingTemplate | null;
    testCases: LearnerTestCase[] | null;
}

export interface MentorQuestion {
    id: number;
    subTopicId: number;
    questionType: QuestionType;
    slug: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    mark: number;
    hint: string;
    explanation: string;
    timeLimitSeconds?: number | null;
    memoryLimitMb?: number | null;
    difficulty: DifficultyLevel;
    position: number;
    publishedAt?: string | null;
    publishedBy?: string | null;
    createdAt: string;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    totalItems: number;
}

export interface CreateQuestionRequest {
    subTopicId: number;
    questionType: QuestionType;
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
    mark: number;
    hint: string;
    explanation: string;
    timeLimitSeconds?: number | null;
    memoryLimitMb?: number | null;
    difficulty: DifficultyLevel;
    position: number;
    shiftPositions?: boolean;
}

export type UpdateQuestionRequest = CreateQuestionRequest;

export interface MentorMcqOption {
    id: number;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
    position: number;
    createdBy: string;
    createdAt: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
}

export interface CreateMcqOptionRequest {
    optionText: string;
    isCorrect: boolean;
    position: number;
}

export type UpdateMcqOptionRequest = CreateMcqOptionRequest;

export interface MentorCodingTemplate {
    id: number;
    questionId: number;
    technologyId: number;
    starterCode: string;
    executionCode?: string | null;
    solutionCode?: string | null;
    createdBy: string;
    createdAt: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
}

export interface CreateCodingTemplateRequest {
    technologyId: number;
    starterCode: string;
    executionCode?: string | null;
    solutionCode?: string | null;
}

export type UpdateCodingTemplateRequest =
    CreateCodingTemplateRequest;

export interface MentorTestCase {
    id: number;
    questionId: number;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    position: number;
    createdBy?: string | null;
    createdAt: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
}

export interface CreateTestCaseRequest {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    position: number;
}

export type UpdateTestCaseRequest = CreateTestCaseRequest;
