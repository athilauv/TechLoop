interface UserAvatarProps {
    name: string;
    size?: "sm" | "md";
}

const UserAvatar = ({ name, size = "md" }: UserAvatarProps) => {
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";
    const dimension = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm";

    return (
        <div className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--cs-primary)]/15 font-semibold text-[var(--cs-primary)] ${dimension}`}>
            {initial}
        </div>
    );
};

export default UserAvatar;
