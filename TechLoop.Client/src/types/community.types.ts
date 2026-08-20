export interface CommunityPost {
    id: number;
    userId: string;
    userName: string;
    userRoleId: number;
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
    userRoleId: number;
    content: string;
    parentCommentId: number | null;
    createdAt: string;
    updatedAt?: string | null;
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