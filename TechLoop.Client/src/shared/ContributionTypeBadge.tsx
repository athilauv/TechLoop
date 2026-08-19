import { GitBranch, Layers } from "lucide-react";

interface ContributionTypeBadgeProps {
    type: string;
}

export default function ContributionTypeBadge({
                                                  type,
                                              }: ContributionTypeBadgeProps) {
    const isSubTopic = type.toLowerCase().includes("sub");
    const Icon = isSubTopic ? GitBranch : Layers;
    const label = isSubTopic ? "SubTopic" : "Topic";

    return (
        <span
            className="
                inline-flex items-center gap-1.5
                rounded-full
                border border-[var(--cs-border)]
                bg-[var(--cs-bg-surface)]
                px-3 py-1.5
                text-xs font-medium
                text-[var(--cs-text-secondary)]
            "
        >
            <Icon size={13} className="text-[var(--cs-text-muted)]" />
            {label} Contribution
        </span>
    );
}