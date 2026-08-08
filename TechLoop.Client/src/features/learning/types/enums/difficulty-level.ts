export const DifficultyLevel = {
    Beginner: 1,
    Easy: 2,
    Medium: 3,
    Hard: 4,
    Expert: 5,
} as const;

export type DifficultyLevel =
    (typeof DifficultyLevel)[keyof typeof DifficultyLevel];