interface AdminFilterChipProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

/**
 * Small toggle chip used for lightweight client-side filtering
 * (status, difficulty, role, etc.) inside an AdminToolbar.
 */
export default function AdminFilterChip({ label, active, onClick }: AdminFilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`h-10 shrink-0 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                active
                    ? "border-[#00E8C2]/40 bg-[#00E8C2]/10 text-[#00E8C2]"
                    : "border-[#223A59] bg-[#101C30] text-[#8CA3BF] hover:text-white"
            }`}
        >
            {label}
        </button>
    );
}
