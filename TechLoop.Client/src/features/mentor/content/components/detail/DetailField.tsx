interface DetailFieldProps {
    label: string;
    value: string;
    span?: "half" | "full";
}

export default function DetailField({ label, value, span = "half" }: DetailFieldProps) {
    return (
        <div
            className={`rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg-surface)] p-5 ${
                span === "full" ? "md:col-span-2" : ""
            }`}>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--cs-text-muted)]">
                {label}
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-[var(--cs-text-secondary)]">
                {value}
            </p>
        </div>
    );
}

export function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}