import { DifficultyLevel } from "./enums/difficulty-level";
import { QuestionType } from "./enums/question-type";

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