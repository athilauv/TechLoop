import { ExampleType } from "../../../../../types/enums/example-type.ts";
import { cn } from "../../../../../shared/cn.ts";

interface ExampleTypeSelectProps {
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function ExampleTypeSelect({
                                              value,
                                              error,
                                              onChange,
                                          }: ExampleTypeSelectProps) {
    return (
        <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--cs-text-secondary)]">
                Example Type
            </label>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={cn(
                    "w-full rounded-[var(--cs-radius-control)] border bg-[var(--cs-bg-input)] px-3 py-2.5 text-sm text-[var(--cs-text-primary)] outline-none transition",
                    "focus:ring-2 focus:ring-[var(--cs-accent)]/20",
                    error
                        ? "border-[var(--cs-danger-border)]"
                        : "border-[var(--cs-border)] focus:border-[var(--cs-accent)]"
                )}
            >
                <option value="">None</option>
                <option value={ExampleType.Text}>Text</option>
                <option value={ExampleType.Code}>Code</option>
                <option value={ExampleType.Link}>Link</option>
                <option value={ExampleType.Image}>Image</option>
                <option value={ExampleType.Video}>Video</option>
                <option value={ExampleType.Pdf}>PDF</option>
            </select>

            {error && <p className="mt-1 text-xs text-[var(--cs-danger)]">{error}</p>}
        </div>
    );
}