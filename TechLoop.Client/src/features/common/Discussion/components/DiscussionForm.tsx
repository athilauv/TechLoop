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
        <form onSubmit={handleSubmit} className="space-y-3.5">
            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                disabled={submitting}
                autoFocus
                placeholder="Discussion title"
                className="w-full rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] px-3.5 py-2.5 text-sm font-semibold text-[var(--cs-text)] outline-none transition-colors duration-150 placeholder:font-normal placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] focus:ring-2 focus:ring-[var(--cs-primary)]/15 disabled:opacity-50"
            />

            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={4}
                maxLength={5000}
                disabled={submitting}
                placeholder="What's your question or point?"
                className="w-full resize-none rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] px-3.5 py-2.5 text-sm leading-6 text-[var(--cs-text)] outline-none transition-colors duration-150 placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] focus:ring-2 focus:ring-[var(--cs-primary)]/15 disabled:opacity-50"
            />

            <div className="flex items-center justify-end gap-2 pt-0.5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-md px-3.5 py-2 text-sm font-medium text-[var(--cs-text-secondary)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)] disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting || !title.trim() || !content.trim()}
                    className="rounded-md bg-[var(--cs-primary)] px-4 py-2 text-sm font-semibold text-[var(--cs-primary-contrast)] transition-colors duration-150 hover:bg-[var(--cs-primary-hover,var(--cs-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? submittingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default DiscussionForm;
