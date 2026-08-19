import axios from "axios";

interface ApiErrorResponse {
    Success?: boolean;
    success?: boolean;
    Message?: string;
    message?: string;
    title?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

export const getErrorMessage = (
    error: unknown,
    fallbackMessage: string
): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;

        if (data?.errors) {
            const messages = Object.values(data.errors)
                .flat()
                .filter(Boolean);

            if (messages.length > 0) {
                return messages.join("\n");
            }
        }

        if (data?.Message) {
            return data.Message;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.detail) {
            return data.detail;
        }

        if (data?.title) {
            return data.title;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
};