import {
    LayoutDashboard,
    BookOpen,
    Dumbbell,
    Code2,
    Users,
    MessagesSquare,
    Bot,
    BarChart3,
    Trophy,
    Bell,
    User,
    Settings,
    LogOut,
    LogIn,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type NavItem = {
    label: string;
    path: string;
    icon: LucideIcon;
    badge?: number;
    dot?: boolean;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const sections: NavSection[] = [
    {
        title: "MAIN",
        items: [
            { label: "Dashboard", path: "/learner/dashboard", icon: LayoutDashboard },
            { label: "Learn", path: "/learner/learn", icon: BookOpen },
            { label: "Practice", path: "/learner/practice", icon: Dumbbell },
            { label: "Coding", path: "/learner/coding", icon: Code2, badge: 12 },
            { label: "Classrooms", path: "/learner/classrooms", icon: Users },
            { label: "Community", path: "/learner/community", icon: MessagesSquare },
            { label: "Messages", path: "/learner/messages", icon: MessagesSquare, dot: true },
            { label: "AI Mentor", path: "/learner/ai-mentor", icon: Bot },
        ],
    },
    {
        title: "INSIGHTS",
        items: [
            { label: "Analytics", path: "/learner/analytics", icon: BarChart3 },
            { label: "Leaderboard", path: "/learner/leaderboard", icon: Trophy },
            { label: "Notifications", path: "/learner/notifications", icon: Bell },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            { label: "Profile", path: "/learner/profile", icon: User },
            { label: "Settings", path: "/learner/settings", icon: Settings },
        ],
    },
];

interface SidebarProps {
    isAuthenticated?: boolean;
    userName?: string;
    userRole?: string;
    userInitials?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}

export default function Sidebar({
                                    isAuthenticated = true,
                                    userName = "Arjun Mehta",
                                    userRole = "Contributor · Lvl 14",
                                    userInitials = "AM",
                                    onLogin,
                                    onLogout,
                                }: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-[#0A1930] overflow-hidden">

            {/* Logo */}

            <div className="flex h-16 items-center border-b border-white/5 px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17D4C3] font-bold text-[#081423]">
                    TL
                </div>

                <div className="ml-3">
                    <h1 className="text-sm font-semibold text-white">
                        TechLoop
                    </h1>

                    <p className="text-xs text-slate-500">
                        Developer Platform
                    </p>
                </div>
            </div>

            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto px-3 py-5">

                {sections.map((section) => (
                    <div key={section.title} className="mb-7">

                        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {section.title}
                        </p>

                        <div className="space-y-1">

                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                                                isActive
                                                    ? "bg-[#17D4C3]/15 text-white"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={18}
                                                    className={
                                                        isActive
                                                            ? "text-[#17D4C3]"
                                                            : "text-slate-500 group-hover:text-white"
                                                    }
                                                />

                                                <span className="flex-1 font-medium">
                                                    {item.label}
                                                </span>

                                                {item.badge !== undefined && (
                                                    <span className="rounded-full bg-[#17D4C3]/15 px-2 py-0.5 text-xs font-semibold text-[#17D4C3]">
                                                        {item.badge}
                                                    </span>
                                                )}

                                                {item.dot && (
                                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}

                        </div>

                    </div>
                ))}

            </nav>

            {/* Bottom */}

            <div className="border-t border-white/5 p-4">

                {isAuthenticated ? (

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                            {userInitials}
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="truncate text-sm text-white">
                                {userName}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {userRole}
                            </p>

                        </div>

                        <button
                            onClick={onLogout}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                            <LogOut size={18} />
                        </button>

                    </div>

                ) : (

                    <button
                        onClick={onLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17D4C3] py-3 font-medium text-[#081423]"
                    >
                        <LogIn size={18} />
                        Login
                    </button>

                )}

            </div>

        </aside>
    );
}