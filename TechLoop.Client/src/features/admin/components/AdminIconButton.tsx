import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type AdminIconButtonTone = "default" | "accent" | "danger";

const toneClasses: Record<AdminIconButtonTone, string> = {
    default: "text-[#8CA3BF] hover:bg-[#101C30] hover:text-white",
    accent: "text-[#00E8C2] hover:bg-[#00E8C2]/10",
    danger: "text-[#F87171] hover:bg-[#F87171]/10",
};

interface AdminIconButtonProps {
    icon: LucideIcon;
    label: string;
    tone?: AdminIconButtonTone;
    /** Provide to render a router link instead of a button. */
    to?: string;
    onClick?: () => void;
    disabled?: boolean;
}

/**
 * Consistent, accessible row-action control used across admin tables
 * (edit / publish / delete / view). Renders a <button> by default, or a
 * router <Link> when a `to` path is supplied.
 */
export default function AdminIconButton({ icon: Icon, label, tone = "default", to, onClick, disabled }: AdminIconButtonProps) {
    const className = `inline-flex items-center justify-center rounded-lg p-2 transition-colors ${toneClasses[tone]} ${disabled ? "pointer-events-none opacity-40" : ""}`;

    if (to) {
        return (
            <Link to={to} aria-label={label} title={label} className={className}>
                <Icon size={15} />
            </Link>
        );
    }

    return (
        <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={className}>
            <Icon size={15} />
        </button>
    );
}
