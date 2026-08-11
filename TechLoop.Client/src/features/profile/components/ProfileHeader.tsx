import { useMemo } from "react";

interface ProfileHeaderProps {
    username?: string;
    role?: string;
}

export default function ProfileHeader({
                                          username = "",
                                          role = "Learner",
                                      }: ProfileHeaderProps) {
    const initial = useMemo(() => {
        return username.trim().charAt(0).toUpperCase() || "U";
    }, [username]);

    return (
        <div className="flex items-center gap-5">
            {/* Initial Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#17D4C3]/15 border border-[#17D4C3]/20 text-2xl font-bold text-[#17D4C3]">
                {initial}
            </div>

            <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-white">
                    {username || "User"}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    {role}
                </p>
            </div>
        </div>
    );
}