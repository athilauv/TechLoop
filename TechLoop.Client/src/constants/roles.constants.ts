export const USER_ROLE_ID = {
    LEARNER: 1,
    MENTOR: 2,
} as const;

export type UserRoleId = (typeof USER_ROLE_ID)[keyof typeof USER_ROLE_ID];