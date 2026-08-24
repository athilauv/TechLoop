import { DifficultyLevel } from "../types/enums/difficulty-level.ts";
import { QuestionType } from "../types/enums/question-type.ts";

export interface QuestionValidationData {
    subTopicId: number;
    questionType: QuestionType;
    title: string;
    slug: string;
    description: string;
    mark: number;
    timeLimitSeconds?: number | null;
    memoryLimitMb?: number | null;
    difficulty: DifficultyLevel;
    position: number;
    shiftPositions: boolean;
}

export const validateQuestion = (
    data: QuestionValidationData,
    isUpdate = false,
): string | null => {
    if (data.subTopicId <= 0) {
        return isUpdate
            ? "SubTopicId cannot be empty"
            : "Sub topic is required.";
    }

    if (!Object.values(QuestionType).includes(data.questionType)) {
        return "Question type is invalid.";
    }

    const title = data.title.trim();

    if (!title) {
        return isUpdate
            ? "Title cannot be empty"
            : "Title is required.";
    }

    if (title.length > 200) {
        return isUpdate
            ? "Title cannot exceed 200 characters"
            : "Title cannot exceed 200 characters";
    }

    const slug = data.slug.trim();

    if (!slug) {
        return isUpdate
            ? "Slug cannot be empty"
            : "Slug is required.";
    }

    if (slug.length > 200) {
        return isUpdate
            ? "Slug cannot exceed 200 characters"
            : "Slug cannot exceed 200 characters";
    }

    if (!data.description.trim()) {
        return isUpdate
            ? "Description cannot be empty"
            : "Description is required.";
    }

    if (isUpdate) {
        if (data.mark < 0) {
            return "Mark must be greater than or equal 0";
        }
    } else if (data.mark <= 0) {
        return "Mark must be greater than 0.";
    }

    if (data.position <= 0) {
        return isUpdate
            ? "Position must be greater than 0"
            : "Position must be greater than 0";
    }

    if (!Object.values(DifficultyLevel).includes(data.difficulty)) {
        return "Difficulty is invalid.";
    }

    if (isUpdate) {
        if (
            data.timeLimitSeconds !== null &&
            data.timeLimitSeconds !== undefined &&
            data.timeLimitSeconds < 0
        ) {
            return "TimeLimitSeconds must be greater than or equal 0";
        }

        if (
            data.memoryLimitMb !== null &&
            data.memoryLimitMb !== undefined &&
            data.memoryLimitMb < 0
        ) {
            return "MemoryLimitMb must be greater than or equal 0";
        }

        if (
            data.memoryLimitMb === null ||
            data.memoryLimitMb === undefined
        ) {
            return "MemoryLimitMb cannot be empty";
        }
    }

    if (data.questionType === QuestionType.Coding) {
        if (
            data.timeLimitSeconds === null ||
            data.timeLimitSeconds === undefined ||
            data.timeLimitSeconds <= 0
        ) {
            return "Time limit is required for coding questions.";
        }

        if (
            data.memoryLimitMb === null ||
            data.memoryLimitMb === undefined ||
            data.memoryLimitMb <= 0
        ) {
            return "Memory limit is required for coding questions.";
        }
    }

    return null;
};