import type { MentorQuestion } from "./question.types.ts";
import type { MentorSubTopic } from "./subTopic.types.ts";
import type { MentorTopic } from "./topic.types.ts";
import type { TopicContributionPendingResponse } from "./topicContribution.types.ts";

export interface MentorPendingQueueData {
    pendingContributions: TopicContributionPendingResponse[];
    allTopics: MentorTopic[];
    allSubTopics: MentorSubTopic[];
    allQuestions: MentorQuestion[];
    unpublishedTopics: MentorTopic[];
    unpublishedSubTopics: MentorSubTopic[];
    unpublishedQuestions: MentorQuestion[];
}

export const getMentorPendingCount = (data?: MentorPendingQueueData): number => {
    if (!data) {
        return 0;
    }

    return (
        data.pendingContributions.length +
        data.unpublishedTopics.length +
        data.unpublishedSubTopics.length +
        data.unpublishedQuestions.length
    );
};
