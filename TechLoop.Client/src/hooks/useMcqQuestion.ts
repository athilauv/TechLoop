import { useMutation, useQuery } from "@tanstack/react-query";
import { getMcqQuestionBySubTopic, submitMcqAnswer } from "../api/question.api.ts";
import type { SubmitMcqAnswerRequest } from "../types/question.types.ts";

export const useMcqQuestion = (subTopicId: number) => {
    return useQuery({
        queryKey: ["mcq-question", subTopicId],
        queryFn: () => getMcqQuestionBySubTopic(subTopicId),
        enabled: subTopicId > 0,
    });
};

export const useSubmitMcqAnswer = () => {
    return useMutation({
        mutationFn: (request: SubmitMcqAnswerRequest) =>
            submitMcqAnswer(request),
    });
};