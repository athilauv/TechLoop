import { CheckCircle2, Clock3, XCircle } from "lucide-react";

interface ContributionStatusBadgeProps {
    status: number;
}

const STATUS_CONFIG: Record<
    number,
    { label: string; icon: typeof Clock3; className: string }
> = {
    1: {
        label: "Pending",
        icon: Clock3,
        className:
            "border-[var(--cs-warning-border)] bg-[var(--cs-warning-subtle)] text-[var(--cs-warning)]",
    },
    2: {
        label: "Approved",
        icon: CheckCircle2,
        className:
            "border-[var(--cs-accent-border)] bg-[var(--cs-accent-subtle)] text-[var(--cs-accent)]",
    },
    3: {
        label: "Rejected",
        icon: XCircle,
        className:
            "border-[var(--cs-danger-border)] bg-[var(--cs-danger-subtle)] text-[var(--cs-danger)]",
    },
};

export default function ContributionStatusBadge({
                                                    status,
                                                }: ContributionStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[1];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
        >
            <Icon size={13} />
            {config.label}
        </span>
    );
}