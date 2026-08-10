export const ExampleType = {
    Text: 1,
    Code: 2,
    Link: 3,
    Image: 4,
    Video: 5,
    Pdf: 6,
} as const;

export type ExampleType =
    (typeof ExampleType)[keyof typeof ExampleType];