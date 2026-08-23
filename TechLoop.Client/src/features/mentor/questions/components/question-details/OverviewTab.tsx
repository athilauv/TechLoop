import { useQuery } from "@tanstack/react-query";

import { getMentorSubTopics } from "../../../../../api/mentorSubTopic.api.ts";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type { MentorQuestion } from "../../../../../types/question.types.ts";
import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";

interface OverviewTabProps {
    question: MentorQuestion;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-xs font-medium text-[var(--cs-text-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[var(--cs-text)]">
            {value}
        </p>
    </div>
);

const formatDate = (value?: string | null): string => {
    if (!value) {
        return "Not set";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const OverviewTab = ({ question }: OverviewTabProps) => {
    const isCoding = question.questionType === QuestionType.Coding;

    // Reuses the same query key as the create/edit form pages
    // (see CodingQuestionFormPage / McqQuestionFormPage), so this
    // never fires a second network request if the list is already
    // cached from elsewhere in the app — it only resolves the name
    // for display, never invents or hardcodes one.
    const { data: subTopics, isLoading: subTopicsLoading } = useQuery<MentorSubTopic[]>({
        queryKey: ["mentor-subtopics"],
        queryFn: () => getMentorSubTopics(),
    });

    const subTopicName = subTopics?.find((subTopic) => subTopic.id === question.subTopicId)?.title;

    const subTopicValue = subTopicsLoading
        ? "Loading..."
        : (subTopicName ?? `Sub Topic #${question.subTopicId} (not found)`);

    return (
        <div className="space-y-8 py-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem label="Marks" value={String(question.mark)} />
                <InfoItem label="Position" value={String(question.position)} />
                <InfoItem label="Slug" value={question.slug} />
                <InfoItem label="Sub Topic" value={subTopicValue} />

                {isCoding && (
                    <>
                        <InfoItem
                            label="Time Limit"
                            value={
                                question.timeLimitSeconds != null
                                    ? `${question.timeLimitSeconds} seconds`
                                    : "Not set"
                            }
                        />
                        <InfoItem
                            label="Memory Limit"
                            value={
                                question.memoryLimitMb != null
                                    ? `${question.memoryLimitMb} MB`
                                    : "Not set"
                            }
                        />
                    </>
                )}

                <InfoItem label="Created At" value={formatDate(question.createdAt)} />
                <InfoItem label="Updated At" value={formatDate(question.updatedAt)} />
            </div>

            {(question.hint || question.explanation) && (
                <div className="grid gap-6 border-t border-[var(--cs-border)] pt-6 lg:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--cs-text)]">Hint</h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                            {question.hint || "No hint provided."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                            Explanation
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--cs-text-secondary)]">
                            {question.explanation || "No explanation provided."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
