interface MentorBadgeProps {
    size?: "sm" | "xs";
}

export default function MentorBadge({ size = "xs" }: MentorBadgeProps) {
    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-1.5 py-0.5 text-[8px]";

    return (
        <span className={`rounded-full border border-[#17D4C3]/30 bg-[#17D4C3]/10 font-semibold uppercase tracking-wide text-[#17D4C3] ${sizeClasses}`}>
            Mentor
        </span>
    );
}
