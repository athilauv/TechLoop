import type {CurrentUser} from "../types/auth.types.ts";

const API_URL = `${import.meta.env.VITE_API_URL}/Auth`;

// LOGIN
export async function login(data: {
    email: string;
    password: string;
}) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Login failed"
        );
    }

    return result;
}

// REGISTER
export async function register(data: {
    username: string;
    email: string;
    password: string;
}) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Registration failed"
        );
    }

    return result;
}

// REFRESH TOKEN
export async function refreshToken() {
    const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Session expired"
        );
    }

    return result;
}

// LOGOUT
export async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Logout failed"
        );
    }

    return result;
}

// CHANGE PASSWORD
export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) {
    const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Failed to change password"
        );
    }

    return result;
}

// FORGOT PASSWORD
export async function forgotPassword(data: {
    email: string;
}) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Failed to send password reset link"
        );
    }

    return result;
}

// RESET PASSWORD
export async function resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
}) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Failed to reset password"
        );
    }

    return result;
}

// MENTOR INITIAL PROFILE / PASSWORD SETUP
export async function setupMentorProfile(
    email: string,
    data: {
        password: string;
        confirmPassword: string;
        phoneNumber: string;
        bio: string;
        linkedInUrl: string;
        githubUrl: string;
        profileImageUrl: string;
    }
) {
    const response = await fetch(
        `${API_URL}/update-profile/${encodeURIComponent(email)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.Message ||
            "Unable to activate mentor account"
        );
    }

    return result;
}

export async function getCurrentUser(): Promise<CurrentUser> {
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Unable to get current user (${response.status})`
        );
    }

    return await response.json();
}
