import { Edit3, Layers3, Trash2, Upload } from "lucide-react";
import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";
import Card, { CardSection} from "../../../../../shared/Card.tsx";
import Button from "../../../../../shared/Button.tsx";
import StatusBadge from "../../../../../shared/StatusBadge.tsx";
import DetailField, { formatDate } from "./DetailField.tsx";
import ExamplePreview from "./ExamplePreview.tsx";

interface SubTopicDetailPanelProps {
    subTopic: MentorSubTopic;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onPublish: (id: number) => void;
}

export default function SubTopicDetailPanel({
                                                subTopic,
                                                onEdit,
                                                onDelete,
                                                onPublish,
                                            }: SubTopicDetailPanelProps) {
    const isPublished = subTopic.publishedAt !== null;

    return (
        <div className="mx-auto max-w-5xl p-8">
            <Card>
                {/* Header */}
                <CardSection divider="bottom">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-md border border-[var(--cs-border)] bg-[var(--cs-bg-surface)] p-2">
                                    <Layers3 size={18} className="text-[var(--cs-accent)]" />
                                </span>

                                <span className="text-xs uppercase tracking-wider text-[var(--cs-text-muted)]">
                                    SubTopic
                                </span>
                            </div>

                            <h1 className="mt-4 text-3xl font-semibold text-[var(--cs-text-primary)]">
                                {subTopic.title}
                            </h1>

                            <p className="mt-2 text-sm text-[var(--cs-text-muted)]">
                                {subTopic.slug}
                            </p>
                        </div>

                        <StatusBadge published={isPublished} />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                            variant="secondary"
                            icon={<Edit3 size={15} />}
                            onClick={() => onEdit(subTopic.id)}
                        >
                            Edit
                        </Button>

                        {!isPublished && (
                            <Button
                                variant="accent-outline"
                                icon={<Upload size={15} />}
                                onClick={() => onPublish(subTopic.id)}
                            >
                                Publish
                            </Button>
                        )}

                        <Button
                            variant="danger"
                            icon={<Trash2 size={15} />}
                            onClick={() => onDelete(subTopic.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </CardSection>

                {/* Details */}
                <div className="grid gap-6 p-7 md:grid-cols-2">
                    <DetailField
                        label="Description"
                        value={subTopic.description || "No description provided."}
                        span="full"
                    />

                    <DetailField label="Position" value={String(subTopic.position)} />
                    <DetailField label="Topic" value={subTopic.topicTitle || "Unknown"} />
                    <DetailField label="Created" value={formatDate(subTopic.createdAt)} />
                    <DetailField
                        label="Updated"
                        value={subTopic.updatedAt ? formatDate(subTopic.updatedAt) : "Not updated"}
                    />
                    <DetailField label="Created By" value={subTopic.createdBy ?? "Unknown"} />
                    <DetailField
                        label="Published By"
                        value={subTopic.publishedBy ?? "Not published"}
                    />
                </div>

                {subTopic.example && (
                    <ExamplePreview example={subTopic.example} exampleType={subTopic.exampleType} />
                )}
            </Card>
        </div>
    );
}