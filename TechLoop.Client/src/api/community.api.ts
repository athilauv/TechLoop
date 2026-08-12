import type {
    CommunityPost,
    CreateCommentRequest,
    CreatePostRequest,
    PostComment,
    SavedPost,
    UpdateCommentRequest,
    UpdatePostRequest,
} from "../types/community.types";

const API_URL = "http://localhost:5264/api/learner/community";

async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),

            ...options.headers,
        },
    });

    const text = await response.text();

    if (!response.ok) {
        let message = `Request failed with status code ${response.status}`;

        if (text) {
            try {
                const result = JSON.parse(text);

                message =
                    result?.message ||
                    result?.Message ||
                    result?.title ||
                    message;
            } catch {
                message = text;
            }
        }

        throw new Error(message);
    }

    if (!text.trim()) {
        return undefined as T;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        throw new Error(
            "Community API returned an invalid response."
        );
    }
}

export async function getCommunityFeed(): Promise<CommunityPost[]> {
    return request<CommunityPost[]>(
        `${API_URL}/posts`
    );
}

export async function getCommunityPost(
    postId: number
): Promise<CommunityPost> {
    return request<CommunityPost>(
        `${API_URL}/posts/${postId}`
    );
}

export async function createPost(
    data: CreatePostRequest
): Promise<CommunityPost> {
    return request<CommunityPost>(
        `${API_URL}/posts`,
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

export async function updatePost(
    postId: number,
    data: UpdatePostRequest
): Promise<CommunityPost> {
    return request<CommunityPost>(
        `${API_URL}/posts/${postId}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
}

export async function deletePost(
    postId: number
): Promise<void> {
    await request<void>(
        `${API_URL}/posts/${postId}`,
        {
            method: "DELETE",
        }
    );
}

export async function getPostComments(
    postId: number
): Promise<PostComment[]> {
    return request<PostComment[]>(
        `${API_URL}/posts/${postId}/comments`
    );
}

export async function getComment(
    commentId: number
): Promise<PostComment> {
    return request<PostComment>(
        `${API_URL}/comments/${commentId}`
    );
}

export async function createComment(
    postId: number,
    data: CreateCommentRequest
): Promise<PostComment> {
    return request<PostComment>(
        `${API_URL}/posts/${postId}/comments`,
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

export async function updateComment(
    commentId: number,
    data: UpdateCommentRequest
): Promise<PostComment> {
    return request<PostComment>(
        `${API_URL}/comments/${commentId}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
}

export async function deleteComment(
    commentId: number
): Promise<void> {
    await request<void>(
        `${API_URL}/comments/${commentId}`,
        {
            method: "DELETE",
        }
    );
}

export async function likePost(
    postId: number
): Promise<number> {
    return request<number>(
        `${API_URL}/posts/${postId}/likes`,
        {
            method: "POST",
        }
    );
}

export async function unlikePost(
    postId: number
): Promise<void> {
    await request<void>(
        `${API_URL}/posts/${postId}/likes`,
        {
            method: "DELETE",
        }
    );
}

export async function getLikeStatus(
    postId: number
): Promise<boolean> {
    return request<boolean>(
        `${API_URL}/posts/${postId}/likes/me`
    );
}

export async function savePost(
    postId: number
): Promise<number> {
    return request<number>(
        `${API_URL}/posts/${postId}/save`,
        {
            method: "POST",
        }
    );
}

export async function unsavePost(
    postId: number
): Promise<void> {
    await request<void>(
        `${API_URL}/posts/${postId}/save`,
        {
            method: "DELETE",
        }
    );
}

export async function getSavedPosts(): Promise<SavedPost[]> {
    return request<SavedPost[]>(
        `${API_URL}/saved-posts`
    );
}