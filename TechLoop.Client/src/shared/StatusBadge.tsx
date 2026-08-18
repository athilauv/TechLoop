import { CheckCircle2, Circle } from "lucide-react";

interface StatusBadgeProps {
    published: boolean;
}

export default function StatusBadge({ published }: StatusBadgeProps) {
    if (published) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--cs-accent)]">
                <CheckCircle2 size={13} />
                Published
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--cs-warning)]">
            <Circle size={9} className="fill-current" />
            Draft
        </span>
    );
}