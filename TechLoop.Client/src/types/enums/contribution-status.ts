export const CONTRIBUTION_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    PUBLISHED: 4,
} as const;

export type ContributionStatus =
    (typeof CONTRIBUTION_STATUS)[keyof typeof CONTRIBUTION_STATUS];