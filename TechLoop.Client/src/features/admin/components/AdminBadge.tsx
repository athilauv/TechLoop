import type { ReactNode } from "react";

export type AdminBadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface AdminBadgeProps {
    tone?: AdminBadgeTone;
    children: ReactNode;
    dot?: boolean;
}

const toneClasses: Record<AdminBadgeTone, string> = {
    success: "bg-[#00E8C2]/10 text-[#00E8C2]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
    danger: "bg-[#F87171]/10 text-[#F87171]",
    info: "bg-[#60A5FA]/10 text-[#60A5FA]",
    neutral: "bg-[#5C7394]/10 text-[#8CA3BF]",
};

/**
 * Small status/type pill used across admin tables (published state,
 * account status, difficulty, question type, etc).
 */
export default function AdminBadge({ tone = "neutral", children, dot = false }: AdminBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
        >
            {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
            {children}
        </span>
    );
}
