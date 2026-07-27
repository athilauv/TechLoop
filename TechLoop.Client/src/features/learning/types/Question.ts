export interface Question {
    id: number;
    subTopicId: number;
    title: string;
    description: string;
    difficulty: string;
    questionType: string;
    position: number
    createdAt: string;
    updatedAt: string | null;
}