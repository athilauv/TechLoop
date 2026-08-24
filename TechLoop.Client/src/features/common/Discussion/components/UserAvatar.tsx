interface UserAvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
}

// Alternates between the primary teal and a restrained pink accent so
// different participants in a thread stay visually distinct at a glance.
const ACCENTS = [
    {
        bg: "bg-[var(--cs-primary)]/12",
        text: "text-[var(--cs-primary)]",
        ring: "ring-[var(--cs-primary)]/25",
    },
    {
        bg: "bg-pink-400/12",
        text: "text-pink-400",
        ring: "ring-pink-400/25",
    },
];

const getAccent = (name: string) => {
    const seed = name?.trim()?.toUpperCase()?.charCodeAt(0) ?? 0;
    return ACCENTS[seed % ACCENTS.length];
};

const UserAvatar = ({ name, size = "md" }: UserAvatarProps) => {
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";
    const accent = getAccent(name || "U");

    const dimension =
        size === "sm"
            ? "h-8 w-8 text-xs"
            : size === "lg"
                ? "h-11 w-11 text-base"
                : "h-9 w-9 text-sm";

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ${accent.bg} ${accent.text} ${accent.ring} ${dimension}`}
        >
            {initial}
        </div>
    );
};

export default UserAvatar;
