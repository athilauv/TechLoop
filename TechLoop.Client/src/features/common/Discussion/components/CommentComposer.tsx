import { Send } from "lucide-react";
import { useState } from "react";

interface CommentComposerProps {
    placeholder: string;
    submitLabel: string;
    submittingLabel: string;
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    autoFocus?: boolean;
    compact?: boolean;
}

const CommentComposer = ({
    placeholder,
    submitLabel,
    submittingLabel,
    onSubmit,
    onCancel,
    autoFocus = false,
    compact = false,
}: CommentComposerProps) => {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);

        try {
            await onSubmit(trimmed);
            setContent("");
        } catch {
            // Error toast is handled by the caller.
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className={`rounded-lg border border-[var(--cs-border)] bg-[var(--cs-input-bg,var(--cs-surface-muted))] transition-colors focus-within:border-[var(--cs-primary)]/60 focus-within:ring-2 focus-within:ring-[var(--cs-primary)]/15 ${
                compact ? "p-2.5" : "p-3"
            }`}
        >
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        void handleSubmit();
                    }
                }}
                rows={compact ? 2 : 3}
                maxLength={1000}
                disabled={submitting}
                autoFocus={autoFocus}
                placeholder={placeholder}
                aria-label={placeholder}
                className="w-full resize-none bg-transparent text-sm leading-6 text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--cs-text-muted)]">
                    {content.length > 0 ? `${content.length}/1000` : ""}
                </span>

                <div className="flex items-center gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--cs-text-secondary)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--cs-text)] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={submitting || !content.trim()}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[var(--cs-primary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--cs-primary-contrast)] transition-colors duration-150 hover:bg-[var(--cs-primary-hover,var(--cs-primary))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cs-primary)]/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={13} />
                        {submitting ? submittingLabel : submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentComposer;
