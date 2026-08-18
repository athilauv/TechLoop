import { cn } from "../../../../../shared/cn.ts";

interface FormFieldProps {
    label: string;
    value: string;
    type?: string;
    error?: string;
    required?: boolean;
    onChange: (value: string) => void;
}

export default function FormField({
                                      label,
                                      value,
                                      type = "text",
                                      error,
                                      required = false,
                                      onChange,
                                  }: FormFieldProps) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--cs-text-secondary)]">
                {label}
                {required && <span className="ml-1 text-[var(--cs-danger)]">*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={cn(
                    "w-full rounded-[var(--cs-radius-control)] border bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] outline-none transition",
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