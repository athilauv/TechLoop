import { CONTRIBUTION_STATUS } from "../../../../types/enums/contribution-status.ts";

interface ContributionStatusBadgeProps {
    status: number;
}

export default function ContributionStatusBadge({
                                                    status,
                                                }: ContributionStatusBadgeProps) {
    const config = {
        [CONTRIBUTION_STATUS.PENDING]: {
            label: "Pending",
            dot: "bg-amber-400",
            className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        },
        [CONTRIBUTION_STATUS.APPROVED]: {
            label: "Approved",
            dot: "bg-[#00E8C2]",
            className: "bg-[#00E8C2]/10 text-[#00E8C2] border-[#00E8C2]/25",
        },
        [CONTRIBUTION_STATUS.REJECTED]: {
            label: "Rejected",
            dot: "bg-red-400",
            className: "bg-red-500/10 text-red-400 border-red-500/20",
        },
        [CONTRIBUTION_STATUS.PUBLISHED]: {
            label: "Published",
            dot: "bg-emerald-400",
            className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        },
    } as const;

    const current = config[status as keyof typeof config];

    if (!current) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#223A59] bg-[#12233B] px-2.5 py-1 text-xs font-medium text-[#8CA3BF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5C7394]" />
                Unknown
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${current.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
            {current.label}
        </span>
    );
}