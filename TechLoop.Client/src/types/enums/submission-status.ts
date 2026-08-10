export const SubmissionStatus = {
    Pending: 0,
    Accepted: 1,
    WrongAnswer: 2,
    RuntimeError: 3,
    CompileError: 4,
    TimeLimitExceeded: 5,
    MemoryLimitExceeded: 6,
} as const;

export type SubmissionStatus =
    (typeof SubmissionStatus)[keyof typeof SubmissionStatus];