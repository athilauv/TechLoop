import { Edit3, FileText, Plus, Trash2, Upload } from "lucide-react";
import type { MentorTopic } from "../../../../../types/topic.types.ts";
import Card, { CardSection } from "../../../../../shared/Card.tsx";
import Button from "../../../../../shared/Button.tsx";
import StatusBadge from "../../../../../shared/StatusBadge.tsx";
import DetailField, { formatDate } from "./DetailField.tsx";
import ExamplePreview from "./ExamplePreview.tsx";

interface TopicDetailPanelProps {
    topic: MentorTopic;
    onEdit: (id: number) => void;
    onCreateSubTopic: (topicId: number) => void;
    onDelete: (id: number) => void;
    onPublish: (id: number) => void;
}

export default function TopicDetailPanel({
                                             topic,
                                             onEdit,
                                             onCreateSubTopic,
                                             onDelete,
                                             onPublish,
                                         }: TopicDetailPanelProps) {
    const isPublished = topic.publishedAt !== null;

    return (
        <div className="mx-auto max-w-5xl p-8">
            <Card>
                {/* Header */}
                <CardSection divider="bottom">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-md border border-[var(--cs-border)] bg-[var(--cs-bg-surface)] p-2">
                                    <FileText size={18} className="text-[var(--cs-accent)]" />
                                </span>

                                <span className="text-xs uppercase tracking-wider text-[var(--cs-text-muted)]">
                                    Topic
                                </span>
                            </div>

                            <h1 className="mt-4 text-3xl font-semibold text-[var(--cs-text-primary)]">
                                {topic.title}
                            </h1>

                            <p className="mt-2 text-sm text-[var(--cs-text-muted)]">{topic.slug}</p>
                        </div>

                        <StatusBadge published={isPublished} />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                            variant="secondary"
                            icon={<Edit3 size={15} />}
                            onClick={() => onEdit(topic.id)}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="primary"
                            icon={<Plus size={15} />}
                            onClick={() => onCreateSubTopic(topic.id)}
                        >
                            Add SubTopic
                        </Button>

                        {!isPublished && (
                            <Button
                                variant="accent-outline"
                                icon={<Upload size={15} />}
                                onClick={() => onPublish(topic.id)}
                            >
                                Publish
                            </Button>
                        )}

                        <Button
                            variant="danger"
                            icon={<Trash2 size={15} />}
                            onClick={() => onDelete(topic.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </CardSection>

                {/* Details */}
                <div className="grid gap-6 p-7 md:grid-cols-2">
                    <DetailField
                        label="Description"
                        value={topic.description || "No description provided."}
                        span="full"
                    />

                    <DetailField label="Position" value={String(topic.position)} />
                    <DetailField label="Created" value={formatDate(topic.createdAt)} />
                    <DetailField
                        label="Updated"
                        value={topic.updatedAt ? formatDate(topic.updatedAt) : "Not updated"}
                    />
                    <DetailField label="Created By" value={topic.createdBy ?? "Unknown"} />
                    <DetailField
                        label="Published By"
                        value={topic.publishedBy ?? "Not published"}
                    />
                </div>

                {topic.example && (
                    <ExamplePreview example={topic.example} exampleType={topic.exampleType} />
                )}
            </Card>
        </div>
    );
}