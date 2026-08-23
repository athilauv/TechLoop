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
        <div>
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={compact ? 2 : 3}
                maxLength={1000}
                disabled={submitting}
                autoFocus={autoFocus}
                placeholder={placeholder}
                className="w-full resize-none rounded-lg border border-[var(--cs-border)]/70 bg-[var(--cs-surface-muted)]/60 px-3 py-2 text-xs leading-5 text-[var(--cs-text)] outline-none placeholder:text-[var(--cs-text-muted)] focus:border-[var(--cs-primary)] disabled:opacity-50"
            />

            <div className="mt-1.5 flex items-center justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="rounded-md px-2.5 py-1.5 text-[11px] text-[var(--cs-text-muted)] transition-colors hover:text-[var(--cs-text)] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={submitting || !content.trim()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--cs-primary,#00C9A7)] bg-[var(--cs-primary,#00C9A7)] px-3 py-1.5 text-[11px] font-semibold text-[var(--cs-primary-contrast,#081423)] transition-colors hover:bg-[var(--cs-primary-hover,#00DDB9)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send size={12} />
                    {submitting ? submittingLabel : submitLabel}
                </button>
            </div>
        </div>
    );
};

export default CommentComposer;
