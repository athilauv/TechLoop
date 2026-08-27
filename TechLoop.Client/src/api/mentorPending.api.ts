import { getMentorQuestions } from "./mentorQuestion.api.ts";
import { getMentorSubTopics } from "./mentorSubTopic.api.ts";
import { getMentorTopics } from "./mentorTopic.api.ts";
import { getPendingTopicContributions } from "./mentorTopicContribution.api.ts";
import type { MentorPendingQueueData } from "../types/mentorPending.types.ts";

export const getMentorPendingQueue = async (): Promise<MentorPendingQueueData> => {
    const [
        allTopics,
        allSubTopics,
        allQuestions,
        pendingContributions,
    ] = await Promise.all([
        getMentorTopics(),
        getMentorSubTopics(),
        getMentorQuestions(),
        getPendingTopicContributions(),
    ]);

    const unpublishedTopics = allTopics.filter(
        (topic) => !topic.publishedAt,
    );

    const unpublishedSubTopics = allSubTopics.filter(
        (subTopic) => !subTopic.publishedAt,
    );

    const unpublishedQuestions = allQuestions.filter(
        (question) => !question.publishedAt,
    );

    return {
        pendingContributions,
        allTopics,
        allSubTopics,
        allQuestions,
        unpublishedTopics,
        unpublishedSubTopics,
        unpublishedQuestions,
    };
};