import { CONTRIBUTION_STATUS } from "../../../../types/enums/contribution-status.ts";

interface ContributionStatusBadgeProps {
    status: number;
}

export default function ContributionStatusBadge({
                                                    status,
                                                }: ContributionStatusBadgeProps) {
    const config = {
        [CONTRIBUTION_STATUS.PENDING]: {
            label: "pending",
            dot: "bg-[var(--cs-warning)]",
            text: "text-[var(--cs-warning)]",
            border: "border-[var(--cs-warning-border)]",
            bg: "bg-[var(--cs-warning-subtle)]",
        },
        [CONTRIBUTION_STATUS.APPROVED]: {
            label: "approved",
            dot: "bg-[var(--cs-accent)]",
            text: "text-[var(--cs-accent)]",
            border: "border-[var(--cs-accent-border)]",
            bg: "bg-[var(--cs-accent-subtle)]",
        },
        [CONTRIBUTION_STATUS.REJECTED]: {
            label: "rejected",
            dot: "bg-[var(--cs-danger)]",
            text: "text-[var(--cs-danger)]",
            border: "border-[var(--cs-danger-border)]",
            bg: "bg-[var(--cs-danger-subtle)]",
        },
        [CONTRIBUTION_STATUS.PUBLISHED]: {
            label: "published",
            dot: "bg-[var(--cs-success)]",
            text: "text-[var(--cs-success)]",
            border: "border-[var(--cs-success-border)]",
            bg: "bg-[var(--cs-success-subtle)]",
        },
    } as const;

    const current = config[status as keyof typeof config];

    if (!current) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cs-border)] px-2.5 py-1 font-[var(--cs-font-mono)] text-[11px] font-medium tracking-wide text-[var(--cs-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--cs-text-muted)]" />
                unknown
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-[var(--cs-font-mono)] text-[11px] font-medium tracking-wide ${current.border} ${current.bg} ${current.text}`}
        >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${current.dot}`} />
            {current.label}
        </span>
    );
}
