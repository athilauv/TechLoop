import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { ExampleType } from "../../../../../types/enums/example-type.ts";
import type { CreateSubTopicRequest, MentorSubTopic, UpdateSubTopicRequest } from "../../../../../types/subTopic.types.ts";
import Button from "../../../../../shared/Button.tsx";
import FormField from "./FormField.tsx";
import FormTextArea from "./FormTextArea.tsx";
import ExampleTypeSelect from "./ExampleTypeSelect.tsx";

interface SubTopicFormProps {
    mode: "create" | "edit";
    topicId?: number;
    subTopic?: MentorSubTopic;

    onSubmit:
        | ((request: CreateSubTopicRequest) => void | Promise<void>)
        | ((request: UpdateSubTopicRequest) => void | Promise<void>);

    onClose: () => void;
}

interface FormState {
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    example: string;
    exampleType: string;
    position: string;
}

export default function SubTopicForm({
                                         mode,
                                         topicId,
                                         subTopic,
                                         onSubmit,
                                         onClose,
                                     }: SubTopicFormProps) {
    const [form, setForm] = useState<FormState>(() => ({
        title: mode === "edit" ? subTopic?.title ?? "" : "",
        slug: mode === "edit" ? subTopic?.slug ?? "" : "",
        description: mode === "edit" ? subTopic?.description ?? "" : "",
        imageUrl: mode === "edit" ? subTopic?.imageUrl ?? "" : "",
        example: mode === "edit" ? subTopic?.example ?? "" : "",
        exampleType:
            mode === "edit" &&
            subTopic?.exampleType !== null &&
            subTopic?.exampleType !== undefined
                ? String(subTopic.exampleType)
                : "",
        position: mode === "edit" ? String(subTopic?.position ?? 1) : "1",
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const updateField = (field: keyof FormState, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));
    };

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (mode === "create" && (!topicId || topicId <= 0)) {
            nextErrors.topicId = "Topic is required.";
        }

        if (!form.title.trim()) {
            nextErrors.title = "Title is required.";
        }

        if (!form.slug.trim()) {
            nextErrors.slug = "Slug is required.";
        }

        if (!form.description.trim()) {
            nextErrors.description = "Description is required.";
        }

        const position = Number(form.position);

        if (!Number.isInteger(position) || position <= 0) {
            nextErrors.position = "Position must be greater than zero.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const actualTopicId = mode === "create" ? topicId : subTopic?.topicId;

        if (!actualTopicId || actualTopicId <= 0) {
            setErrors({
                topicId: "Topic is required.",
            });

            return;
        }

        const exampleType = form.exampleType
            ? (Number(form.exampleType) as ExampleType)
            : null;

        const position = Number(form.position);

        try {
            setLoading(true);

            if (mode === "create") {
                const request: CreateSubTopicRequest = {
                    topicId: actualTopicId,
                    parentSubTopicId: null,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    imageUrl: form.imageUrl.trim() || null,
                    slug: form.slug.trim(),
                    example: form.example.trim() || null,
                    exampleType,
                    position,
                    shiftPositions: false,
                };

                await (
                    onSubmit as (request: CreateSubTopicRequest) => void | Promise<void>
                )(request);
            } else {
                const request: UpdateSubTopicRequest = {
                    topicId: actualTopicId,
                    parentSubTopicId: null,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    imageUrl: form.imageUrl.trim() || null,
                    slug: form.slug.trim(),
                    example: form.example.trim() || null,
                    exampleType,
                    position,
                    shiftPositions: false,
                };

                await (
                    onSubmit as (request: UpdateSubTopicRequest) => void | Promise<void>
                )(request);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[var(--cs-radius-card)] border border-[var(--cs-border)] bg-[var(--cs-bg-card)]"
        >
            <div className="flex items-center justify-between border-b border-[var(--cs-border)] px-7 py-5">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--cs-text-primary)]">
                        {mode === "create" ? "Create SubTopic" : "Edit SubTopic"}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        Manage the content under this topic.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-[var(--cs-text-muted)] transition hover:bg-white/5 hover:text-[var(--cs-text-primary)]"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-5 p-7">
                {errors.topicId && (
                    <div className="rounded-lg border border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] px-4 py-3 text-sm text-[var(--cs-danger)]">
                        {errors.topicId}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        label="Title"
                        value={form.title}
                        error={errors.title}
                        required
                        onChange={(value) => updateField("title", value)}
                    />

                    <FormField
                        label="Slug"
                        value={form.slug}
                        error={errors.slug}
                        required
                        onChange={(value) => updateField("slug", value)}
                    />

                    <FormField
                        label="Image URL"
                        value={form.imageUrl}
                        onChange={(value) => updateField("imageUrl", value)}
                    />

                    <FormField
                        label="Position"
                        type="number"
                        value={form.position}
                        error={errors.position}
                        required
                        onChange={(value) => updateField("position", value)}
                    />
                </div>

                <FormTextArea
                    label="Description"
                    value={form.description}
                    error={errors.description}
                    required
                    onChange={(value) => updateField("description", value)}
                />

                <ExampleTypeSelect
                    value={form.exampleType}
                    onChange={(value) => updateField("exampleType", value)}
                />

                <FormTextArea
                    label="Example"
                    value={form.example}
                    onChange={(value) => updateField("example", value)}
                />
            </div>

            <div className="flex justify-end gap-3 border-t border-[var(--cs-border)] px-7 py-5">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary" loading={loading}>
                    {mode === "create" ? "Create SubTopic" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}