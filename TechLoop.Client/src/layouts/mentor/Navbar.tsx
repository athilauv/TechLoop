import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ChevronDown } from "lucide-react";
import { getMentorProfile } from "../../api/mentor.api.ts";

interface MentorNavbarProps {
    hidden?: boolean;
    collapsed: boolean;
    onMenuClick: () => void;
}

export default function MentorNavbar({
    hidden = false,
    collapsed,
    onMenuClick,
}: MentorNavbarProps) {
    const { data: profile } = useQuery({
        queryKey: ["mentor-profile"],
        queryFn: getMentorProfile,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const username =
        profile?.username?.trim() ||
        localStorage.getItem("username")?.trim() ||
        localStorage.getItem("userName")?.trim() ||
        "Mentor";

    const initial = username.charAt(0).toUpperCase();

    return (
        <header
            className={[
                "fixed top-0 right-0 z-30 h-16 border-b border-white/5 bg-[#0E192A]/95 backdrop-blur-md transition-all duration-300",
                hidden
                    ? "-translate-y-full"
                    : "translate-y-0",
                collapsed
                    ? "md:left-[72px]"
                    : "md:left-64",
            ].join(" ")}
        >
            <div className="flex h-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <h1 className="hidden text-lg font-semibold text-white lg:block">
                        TechLoop
                    </h1>
                </div>

                <div className="hidden flex-1 justify-center px-8 md:flex">
                    <div className="relative w-full max-w-xl">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="text"
                            placeholder="Search technologies, topics, questions..."
                            aria-label="Search"
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#081423] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#17D4C3]"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                            {initial}
                        </div>

                        <div className="hidden text-left lg:block">
                            <p className="text-sm font-medium text-white">
                                {username}
                            </p>
                            <p className="text-xs text-slate-500">
                                Mentor
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className="hidden text-slate-500 lg:block"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
