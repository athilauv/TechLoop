import { cn } from "../../../../../shared/cn.ts";

interface FormTextAreaProps {
    label: string;
    value: string;
    error?: string;
    required?: boolean;
    rows?: number;
    onChange: (value: string) => void;
}

export default function FormTextArea({
                                         label,
                                         value,
                                         error,
                                         required = false,
                                         rows = 5,
                                         onChange,
                                     }: FormTextAreaProps) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--cs-text-secondary)]">
                {label}
                {required && <span className="ml-1 text-[var(--cs-danger)]">*</span>}
            </label>

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={rows}
                className={cn(
                    "w-full resize-y rounded-[var(--cs-radius-control)] border bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] outline-none transition",
                    "focus:ring-2 focus:ring-[var(--cs-accent)]/20",
                    error
                        ? "border-[var(--cs-danger-border)]"
                        : "border-[var(--cs-border)] focus:border-[var(--cs-accent)]"
                )}
            />

            {error && <p className="mt-1 text-xs text-[var(--cs-danger)]">{error}</p>}
        </div>
    );
}