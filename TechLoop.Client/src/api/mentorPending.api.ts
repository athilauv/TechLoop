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

    return {
        pendingContributions,
        allTopics,
        allSubTopics,
        allQuestions,
        unpublishedTopics: allTopics.filter((topic) => !topic.publishedAt),
        unpublishedSubTopics: allSubTopics.filter(
            (subTopic) => !subTopic.publishedAt,),
        unpublishedQuestions: allQuestions.filter(
            (question) => !question.publishedAt,),
    };
};