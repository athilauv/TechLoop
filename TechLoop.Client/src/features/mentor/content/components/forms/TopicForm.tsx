import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { CreateTopicRequest, MentorTopic, UpdateTopicRequest } from "../../../../../types/topic.types.ts";
import { ExampleType } from "../../../../../types/enums/example-type.ts";
import Button from "../../../../../shared/Button.tsx";
import FormField from "./FormField.tsx";
import FormTextArea from "./FormTextArea.tsx";
import ExampleTypeSelect from "./ExampleTypeSelect.tsx";

interface TopicFormProps {
    mode: "create" | "edit";
    technologyId: number;
    topic?: MentorTopic;
    onSubmit: | ((request: CreateTopicRequest) => void | Promise<void>) | ((request: UpdateTopicRequest) => void | Promise<void>);
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

export default function TopicForm({
                                      mode,
                                      technologyId,
                                      topic,
                                      onSubmit,
                                      onClose,
                                  }: TopicFormProps) {
    const [form, setForm] = useState<FormState>(() => ({
        title: mode === "edit" ? topic?.title ?? "" : "",
        slug: mode === "edit" ? topic?.slug ?? "" : "",
        description: mode === "edit" ? topic?.description ?? "" : "",
        imageUrl: mode === "edit" ? topic?.imageUrl ?? "" : "",
        example: mode === "edit" ? topic?.example ?? "" : "",
        exampleType:
            mode === "edit" &&
            topic?.exampleType !== null &&
            topic?.exampleType !== undefined
                ? String(topic.exampleType)
                : "",
        position:
            mode === "edit" && topic?.position !== undefined
                ? String(topic.position)
                : "1",
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

    const validate = (): boolean => {
        const nextErrors: Record<string, string> = {};

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

        if (form.exampleType) {
            const exampleType = Number(form.exampleType);
            if (!Number.isInteger(exampleType)) {
                nextErrors.exampleType = "Example type must be valid.";
            }
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const exampleType = form.exampleType ? Number(form.exampleType) : null;
        const position = Number(form.position);

        try {
            setLoading(true);

            if (mode === "create") {
                const request: CreateTopicRequest = {
                    technologyId,
                    slug: form.slug.trim(),
                    title: form.title.trim(),
                    description: form.description.trim(),
                    imageUrl: form.imageUrl.trim() || null,
                    example: form.example.trim() || null,
                    exampleType: exampleType as ExampleType | null,
                    position,
                    shiftPositions: false,
                };

                await (onSubmit as (request: CreateTopicRequest) => void | Promise<void>)(
                    request
                );
            } else {
                const request: UpdateTopicRequest = {
                    technologyId,
                    slug: form.slug.trim(),
                    title: form.title.trim(),
                    description: form.description.trim(),
                    imageUrl: form.imageUrl.trim() || null,
                    example: form.example.trim() || null,
                    exampleType: exampleType as ExampleType | null,
                    position,
                    shiftPositions: false,
                };

                await (onSubmit as (request: UpdateTopicRequest) => void | Promise<void>)(
                    request
                );
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
                        {mode === "create" ? "Create Topic" : "Edit Topic"}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--cs-text-muted)]">
                        Manage the topic information.
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
                    error={errors.exampleType}
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
                    {mode === "create" ? "Create Topic" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}