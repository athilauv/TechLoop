import { useState } from "react";

interface DiscussionFormProps {
    initialTitle?: string;
    initialContent?: string;
    submitLabel: string;
    submittingLabel: string;
    onSubmit: (title: string, content: string) => Promise<void>;
    onCancel: () => void;
}

const DiscussionForm = ({
                            initialTitle = "",
                            initialContent = "",
                            submitLabel,
                            submittingLabel,
                            onSubmit,
                            onCancel,
                        }: DiscussionFormProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent || submitting) return;

        setSubmitting(true);

        try {
            await onSubmit(trimmedTitle, trimmedContent);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                disabled={submitting}
                autoFocus
                placeholder="Discussion title"
                className="w-full rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 px-3 py-2.5 text-sm font-medium text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:opacity-50"
            />

            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                maxLength={5000}
                disabled={submitting}
                placeholder="What's your question or point?"
                className="w-full resize-none rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 px-3 py-2.5 text-sm leading-6 text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:opacity-50"
            />

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-lg border border-[var(--cs-border)] px-3.5 py-2 text-xs font-medium text-[var(--cs-text-secondary)] transition-colors hover:bg-[var(--cs-surface-muted)]/60 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting || !title.trim() || !content.trim()}
                    className="rounded-lg border border-[var(--cs-primary,#00e5c0)] bg-[var(--cs-primary,#00C9A7)] px-3.5 py-2 text-xs font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? submittingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default DiscussionForm;
