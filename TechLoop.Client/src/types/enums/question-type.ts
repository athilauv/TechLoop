export const QuestionType = {
    Mcq: 1,
    Coding: 2,
    Challenge: 3,
} as const;

export type QuestionType =
    (typeof QuestionType)[keyof typeof QuestionType];

