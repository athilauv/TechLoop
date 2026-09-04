interface UserAvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
}

const ACCENTS = [
    {
        bg: "bg-[#00e8c2]/12",
        text: "text-[#60a5fa]",
        ring: "ring-[#00e8c2]/25",
    },
    {
        bg: "bg-[#2563eb]/16",
        text: "text-[#93c5fd]",
        ring: "ring-[#2563eb]/30",
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
        size === "sm" ? "h-8 w-8 text-xs"
            : size === "lg" ? "h-11 w-11 text-base" : "h-9 w-9 text-sm";

    return (
        <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ${accent.bg} ${accent.text} ${accent.ring} ${dimension}`}>
            {initial}
        </div>
    );
};

export default UserAvatar;
