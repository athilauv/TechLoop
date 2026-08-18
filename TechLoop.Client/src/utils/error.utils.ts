import axios from "axios";

interface ApiErrorResponse {
    Success?: boolean;
    success?: boolean;
    Message?: string;
    message?: string;
}

export const getErrorMessage = (
    error: unknown, fallbackMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as | ApiErrorResponse | undefined;

        if (data?.Message) {
            return data.Message;
        }

        if (data?.message) {
            return data.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
};