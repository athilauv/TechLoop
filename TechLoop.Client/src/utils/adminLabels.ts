import { DifficultyLevel } from "../types/enums/difficulty-level.ts";
import { QuestionType } from "../types/enums/question-type.ts";
import type { AdminBadgeTone } from "../features/admin/components/AdminBadge.tsx";

const difficultyLabels: Record<number, string> = {
    [DifficultyLevel.Beginner]: "Beginner",
    [DifficultyLevel.Easy]: "Easy",
    [DifficultyLevel.Medium]: "Medium",
    [DifficultyLevel.Hard]: "Hard",
    [DifficultyLevel.Expert]: "Expert",
};

const difficultyTones: Record<number, AdminBadgeTone> = {
    [DifficultyLevel.Beginner]: "info",
    [DifficultyLevel.Easy]: "success",
    [DifficultyLevel.Medium]: "warning",
    [DifficultyLevel.Hard]: "danger",
    [DifficultyLevel.Expert]: "danger",
};

export const getDifficultyLabel = (value: number): string => difficultyLabels[value] ?? `Level ${value}`;
export const getDifficultyTone = (value: number): AdminBadgeTone => difficultyTones[value] ?? "neutral";

const questionTypeLabels: Record<number, string> = {
    [QuestionType.Mcq]: "Multiple choice",
    [QuestionType.Coding]: "Coding",
    [QuestionType.Challenge]: "Challenge",
};

export const getQuestionTypeLabel = (value: number): string => questionTypeLabels[value] ?? `Type ${value}`;
