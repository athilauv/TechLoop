export interface CommunityPost {
    id: number;
    userId: string;
    userName: string;
    technologyId: number | null;
    technologyName: string | null;
    title: string;
    content: string;
    isPinned: boolean;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

export interface CreatePostRequest {
    technologyId?: number | null;
    title: string;
    content: string;
}

export interface UpdatePostRequest {
    technologyId?: number | null;
    title: string;
    content: string;
}

export interface PostComment {
    id: number;
    postId: number;
    userId: string;
    userName: string;
    parentCommentId: number | null;
    content: string;
    replyCount: number;
    createdAt: string;
}

export interface CreateCommentRequest {
    parentCommentId?: number | null;
    content: string;
}

export interface UpdateCommentRequest {
    content: string;
}

export interface SavedPost {
    postId: number;
    userId: string;
    createdAt: string;
}

export interface PostLikeStatus {
    isLiked: boolean;
}