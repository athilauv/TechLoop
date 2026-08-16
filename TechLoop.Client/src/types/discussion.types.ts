export interface Discussion {
    id: number;
    userId: string;
    userName: string;
    questionId: number;
    title: string;
    content: string;
    isPinned: boolean;
    isLocked: boolean;
    commentCount: number;
    createdAt: string;
}

export interface DiscussionComment {
    id: number;
    discussionId: number;
    userId: string;
    userName: string;
    parentCommentId: number | null;
    content: string;
    replyCount: number;
    createdAt: string;
}

export interface CreateDiscussionRequest {
    questionId: number;
    title: string;
    content: string;
}

export interface UpdateDiscussionRequest {
    id: number;
    title: string;
    content: string;
}

export interface CreateDiscussionCommentRequest {
    parentCommentId: number | null;
    content: string;
}

export interface UpdateDiscussionCommentRequest {
    content: string;
}