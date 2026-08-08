import { SubmissionStatus } from "./enums/submission-status.ts";

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

export interface CreateSubmissionRequest {
    questionId: number;
    technologyId: number;
    sourceCode: string;
}

export interface CreateSubmissionResponse {
    id: number;
    message: string;
}

export interface UpdateSubmissionRequest {
    status: SubmissionStatus;
    executionTimeMs: number | null;
    memoryUsedMb: number | null;
    passedTestCases: number | null;
    totalTestCases: number | null;
    score: number | null;
    compilerOutput: string | null;
    runtimeOutput: string | null;
    aiReview: string | null;
    judgeToken: string | null;
}

export interface Submission {
    id: number;
    userId: string;
    questionId: number;
    technologyId: number;
    sourceCode: string;
    status: SubmissionStatus;
    executionTimeMs: number | null;
    memoryUsedMb: number | null;
    passedTestCases: number | null;
    totalTestCases: number | null;
    score: number | null;
    submittedAt: string;
    compilerOutput: string | null;
    runtimeOutput: string | null;
    aiReview: string | null;
    judgeToken: string | null;
}