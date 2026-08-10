import { useMutation, useQuery } from "@tanstack/react-query";

import {
    createSubmission,
    getMySubmissions,
    getQuestionSubmissions,
    getSubmissionById,
    submitMcqAnswer,
} from "../api/submission.api.ts";

export const useCreateSubmission = () => {
    return useMutation({
        mutationFn: createSubmission,
    });
};

export const useSubmitMcqAnswer = () => {
    return useMutation({
        mutationFn: submitMcqAnswer,
    });
};

export const useSubmission = (submissionId: number) => {
    return useQuery({
        queryKey: ["submission", submissionId],
        queryFn: () => getSubmissionById(submissionId),
        enabled: submissionId > 0,
    });
};

export const useQuestionSubmissions = (questionId: number) => {
    return useQuery({
        queryKey: ["question-submissions", questionId],
        queryFn: () => getQuestionSubmissions(questionId),
        enabled: questionId > 0,
    });
};

export const useMySubmissions = () => {
    return useQuery({
        queryKey: ["my-submissions"],
        queryFn: getMySubmissions,
    });
};