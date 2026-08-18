import type { MentorTopic } from "../../../../../types/topic.types.ts";
import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";
import LoadingSpinner from "../../../../../shared/LoadingSpinner.tsx";
import TopicDetailPanel from "./TopicDetailPanel.tsx";
import SubTopicDetailPanel from "./SubTopicDetailPanel.tsx";

interface MentorContentDetailsProps {
    selectedType: "topic" | "subtopic";
    topic: MentorTopic | null;
    subTopic: MentorSubTopic | null;
    onEditTopic: (id: number) => void;
    onEditSubTopic: (id: number) => void;
    onCreateSubTopic: (topicId: number) => void;
    onDeleteTopic: (id: number) => void;
    onDeleteSubTopic: (id: number) => void;
    onPublishTopic: (id: number) => void;
    onPublishSubTopic: (id: number) => void;
}

export default function MentorContentDetails({
                                                 selectedType,
                                                 topic,
                                                 subTopic,
                                                 onEditTopic,
                                                 onEditSubTopic,
                                                 onCreateSubTopic,
                                                 onDeleteTopic,
                                                 onDeleteSubTopic,
                                                 onPublishTopic,
                                                 onPublishSubTopic,
                                             }: MentorContentDetailsProps) {
    if (selectedType === "topic") {
        if (!topic) {
            return <LoadingSpinner fullHeight />;
        }

        return (
            <TopicDetailPanel
                topic={topic}
                onEdit={onEditTopic}
                onCreateSubTopic={onCreateSubTopic}
                onDelete={onDeleteTopic}
                onPublish={onPublishTopic}
            />
        );
    }

    if (!subTopic) {
        return <LoadingSpinner fullHeight />;
    }

    return (
        <SubTopicDetailPanel
            subTopic={subTopic}
            onEdit={onEditSubTopic}
            onDelete={onDeleteSubTopic}
            onPublish={onPublishSubTopic}
        />
    );
}