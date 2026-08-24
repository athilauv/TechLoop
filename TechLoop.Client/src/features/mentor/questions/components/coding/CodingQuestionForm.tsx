import { useEffect, useState } from "react";
import Button from "../../../../../shared/Button.tsx";
import {
    DifficultyLevel,
    type DifficultyLevel as DifficultyLevelType,
} from "../../../../../types/enums/difficulty-level.ts";
import { QuestionType } from "../../../../../types/enums/question-type.ts";
import type {
    CreateQuestionRequest,
    MentorQuestion,
    UpdateQuestionRequest,
} from "../../../../../types/question.types.ts";
import type { MentorSubTopic } from "../../../../../types/subTopic.types.ts";
import { validateQuestion } from "../../../../../validations/question.validation.ts";
import { showToast } from "../../../../../utils/toast.tsx";
import SubTopicSelect from "../shared/SubTopicSelect";
import CustomSelect from "../../../../../shared/Customselect.tsx";

interface CodingQuestionFormProps {
    question?: MentorQuestion;
    subTopics: MentorSubTopic[];
    subTopicsLoading?: boolean;
    submitting?: boolean;
    onSubmit: (request: CreateQuestionRequest | UpdateQuestionRequest) => Promise<void>;
    onCancel: () => void;
}

interface FormState {
    subTopicId: number;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    mark: string;
    hint: string;
    explanation: string;
    timeLimitSeconds: string;
    memoryLimitMb: string;
    difficulty: DifficultyLevelType;
    position: string;
}

const createInitialState = (question?: MentorQuestion): FormState => ({
    subTopicId: question?.subTopicId ?? 0,
    title: question?.title ?? "",
    slug: question?.slug ?? "",
    description: question?.description ?? "",
    imageUrl: question?.imageUrl ?? "",
    mark: String(question?.mark ?? 1),
    hint: question?.hint ?? "",
    explanation: question?.explanation ?? "",
    timeLimitSeconds:
        question?.timeLimitSeconds != null ? String(question.timeLimitSeconds) : "",
    memoryLimitMb:
        question?.memoryLimitMb != null ? String(question.memoryLimitMb) : "",
    difficulty: question?.difficulty ?? DifficultyLevel.Beginner,
    position: String(question?.position ?? 1),
});

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyLevelType; label: string }> = [
    { value: DifficultyLevel.Beginner, label: "Beginner" },
    { value: DifficultyLevel.Easy, label: "Easy" },
    { value: DifficultyLevel.Medium, label: "Medium" },
    { value: DifficultyLevel.Hard, label: "Hard" },
    { value: DifficultyLevel.Expert, label: "Expert" },
];

const CodingQuestionForm = ({
                                question,
                                subTopics,
                                subTopicsLoading = false,
                                submitting = false,
                                onSubmit,
                                onCancel,
                            }: CodingQuestionFormProps) => {
    const [form, setForm] = useState<FormState>(() => createInitialState(question));

    useEffect(() => {
        if (question) {
            setForm(createInitialState(question));
        }
    }, [question]);

    const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const mark = Number(form.mark);
        const position = Number(form.position);

        const timeLimitSeconds = form.timeLimitSeconds.trim()
            ? Number(form.timeLimitSeconds)
            : null;

        const memoryLimitMb = form.memoryLimitMb.trim()
            ? Number(form.memoryLimitMb)
            : null;

        const validationError = validateQuestion(
            {
                subTopicId: form.subTopicId,
                questionType: QuestionType.Coding,
                title: form.title,
                slug: form.slug,
                description: form.description,
                mark,
                timeLimitSeconds,
                memoryLimitMb,
                difficulty: form.difficulty,
                position,
                shiftPositions: false,
            },
            Boolean(question),
        );

        if (validationError) {
            showToast.error(validationError);
            return;
        }

        await onSubmit({
            subTopicId: form.subTopicId,
            questionType: QuestionType.Coding,
            title: form.title.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            imageUrl: form.imageUrl.trim() || undefined,
            mark,
            hint: form.hint.trim(),
            explanation: form.explanation.trim(),
            timeLimitSeconds,
            memoryLimitMb,
            difficulty: form.difficulty,
            position,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Sub Topic
                    </label>
                    <SubTopicSelect
                        subTopics={subTopics}
                        value={form.subTopicId}
                        onChange={(id) => updateField("subTopicId", id)}
                        loading={subTopicsLoading}
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Position
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={form.position}
                        onChange={(event) => updateField("position", event.target.value)}
                        disabled={submitting}
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Title
                </label>
                <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    maxLength={200}
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Slug
                </label>
                <input
                    value={form.slug}
                    onChange={(event) => updateField("slug", event.target.value)}
                    maxLength={200}
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 font-mono text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    rows={6}
                    disabled={submitting}
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-3 text-sm leading-6 text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Mark
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.mark}
                        onChange={(event) => updateField("mark", event.target.value)}
                        disabled={submitting}
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Difficulty
                    </label>
                    <CustomSelect
                        value={String(form.difficulty)}
                        onChange={(value: string) => updateField("difficulty", Number(value) as DifficultyLevelType,)}
                        options={DIFFICULTY_OPTIONS.map((option) => ({
                            value: String(option.value),
                            label: option.label,
                        }))}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Time Limit (seconds)
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={form.timeLimitSeconds}
                        onChange={(event) =>
                            updateField("timeLimitSeconds", event.target.value)
                        }
                        disabled={submitting}
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                        Memory Limit (MB)
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={form.memoryLimitMb}
                        onChange={(event) =>
                            updateField("memoryLimitMb", event.target.value)
                        }
                        disabled={submitting}
                        className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Image URL
                </label>
                <input
                    value={form.imageUrl}
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    disabled={submitting}
                    className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-2.5 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Hint
                </label>
                <textarea
                    value={form.hint}
                    onChange={(event) => updateField("hint", event.target.value)}
                    rows={4}
                    disabled={submitting}
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-3 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cs-text)]">
                    Explanation
                </label>
                <textarea
                    value={form.explanation}
                    onChange={(event) => updateField("explanation", event.target.value)}
                    rows={5}
                    disabled={submitting}
                    className="w-full resize-y rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface-muted)] px-3 py-3 text-sm text-[var(--cs-text)] outline-none focus:border-[var(--cs-primary)]"
                />
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--cs-border)] pt-5">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting
                        ? "Saving..."
                        : question
                            ? "Update Coding Question"
                            : "Create Coding Question"}
                </Button>
            </div>
        </form>
    );
};

export default CodingQuestionForm;
