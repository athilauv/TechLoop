import {
    LayoutDashboard,
    BookOpen,
    Code2,
    //Users,
    MessagesSquare,
    //Bot,
    BarChart3,
    Trophy,
    Bell,
    User,
    LogOut,
    LogIn,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

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
            {
                label: "Dashboard",
                path: "/learner/dashboard",
                icon: LayoutDashboard,
            },
            {
                label: "Learn",
                path: "/learner/learning",
                icon: BookOpen,
            },
            {
                label: "Coding",
                path: "/learner/coding-questions",
                icon: Code2,
            },
            {
                label: "Community",
                path: "/learner/community",
                icon: MessagesSquare,
            },
            {
                label: "Contribution",
                path: "/learner/topic-contributions",
                icon: MessagesSquare,
                dot: true,
            },
            // {
            //     label: "Messages",
            //     path: "/learner/messages",
            //     icon: MessagesSquare,
            //     dot: true,
            // },
            // {
            //     label: "AI Mentor",
            //     path: "/learner/ai-mentor",
            //     icon: Bot,
            // },
        ],
    },
    {
        title: "INSIGHTS",
        items: [
            {
                label: "Analytics",
                path: "/learner/analytics",
                icon: BarChart3,
            },
            {
                label: "Leaderboard",
                path: "/learner/leaderboard",
                icon: Trophy,
            },
            {
                label: "Notifications",
                path: "/learner/notifications",
                icon: Bell,
            },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            {
                label: "Profile",
                path: "/learner/profile",
                icon: User,
            },
        ],
    },
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
    isAuthenticated?: boolean;
    userName?: string;
    userRole?: string;
    userInitials?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}

export default function Sidebar({
                                    collapsed,
                                    onToggleCollapse,
                                    mobileOpen,
                                    onCloseMobile,
                                    isAuthenticated = true,
                                    userName,
                                    userRole,
                                    userInitials,
                                    onLogin,
                                    onLogout,
                                }: SidebarProps) {
    useEffect(() => {
        document.body.style.overflow = mobileOpen
            ? "hidden"
            : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    /*
     * User information will eventually come from
     * the authenticated-user/profile API.
     *
     * For now, use the values passed through props.
     */
    const displayName = userName || "User";
    const displayRole = userRole || "Learner";
    const displayInitial =
        userInitials ||
        displayName.charAt(0).toUpperCase();

    const sidebarWidth = collapsed
        ? "w-[72px]"
        : "w-64";

    return (
        <>
            {/* MOBILE OVERLAY */}

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* SIDEBAR */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex flex-col
                    border-r border-white/5
                    bg-[#0A1930]
                    transition-all duration-300
                    ${sidebarWidth}
                    ${
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }
                    md:translate-x-0
                `}
            >
                {/* HEADER */}

                <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">

                    <div className="flex items-center gap-3 overflow-hidden">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17D4C3] font-bold text-[#081423]">
                            TL
                        </div>

                        {!collapsed && (
                            <div>
                                <h1 className="text-sm font-semibold text-white">
                                    TechLoop
                                </h1>

                                <p className="text-xs text-slate-500">
                                    Developer Platform
                                </p>
                            </div>
                        )}
                    </div>

                    {/* DESKTOP COLLAPSE */}

                    <button
                        onClick={onToggleCollapse}
                        className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:flex"
                    >
                        {collapsed ? (
                            <ChevronRight size={18} />
                        ) : (
                            <ChevronLeft size={18} />
                        )}
                    </button>

                    {/* MOBILE CLOSE */}

                    <button
                        onClick={onCloseMobile}
                        className="rounded-lg p-2 text-slate-400 md:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* NAVIGATION */}

                <nav className="flex-1 overflow-y-auto px-3 py-5">

                    {sections.map((section) => (
                        <div
                            key={section.title}
                            className="mb-7"
                        >
                            {!collapsed && (
                                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {section.title}
                                </p>
                            )}

                            <div className="space-y-1">

                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.label}
                                            to={item.path}
                                            onClick={onCloseMobile}
                                            className={({ isActive }) =>
                                                `
                                                group flex items-center
                                                ${
                                                    collapsed
                                                        ? "justify-center"
                                                        : "gap-3"
                                                }
                                                rounded-xl
                                                px-3
                                                py-3
                                                text-sm
                                                transition-all
                                                duration-200
                                                ${
                                                    isActive
                                                        ? "bg-[#17D4C3]/15 text-white"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                }
                                                `
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

                                                    {!collapsed && (
                                                        <>
                                                            <span className="flex-1 font-medium">
                                                                {item.label}
                                                            </span>

                                                            {item.badge !==
                                                                undefined && (
                                                                    <span className="rounded-full bg-[#17D4C3]/15 px-2 py-0.5 text-xs font-semibold text-[#17D4C3]">
                                                                    {
                                                                        item.badge
                                                                    }
                                                                </span>
                                                                )}

                                                            {item.dot && (
                                                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                                            )}
                                                        </>
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

                {/* USER AREA */}

                <div className="border-t border-white/5 p-4">

                    {isAuthenticated ? (
                        <div
                            className={`flex items-center ${
                                collapsed
                                    ? "justify-center"
                                    : "gap-3"
                            }`}
                        >
                            {/* INITIAL AVATAR */}

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                                {displayInitial}
                            </div>

                            {!collapsed && (
                                <>
                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm text-white">
                                            {displayName}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {displayRole}
                                        </p>

                                    </div>

                                    <button
                                        onClick={onLogout}
                                        className="
                                            rounded-lg
                                            p-2
                                            text-slate-500
                                            transition
                                            hover:bg-red-500/10
                                            hover:text-red-400
                                        "
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={onLogin}
                            className={`
                                flex
                                w-full
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#17D4C3]
                                py-3
                                font-medium
                                text-[#081423]
                                transition
                                hover:brightness-105
                                ${
                                collapsed
                                    ? "px-0"
                                    : "gap-2"
                            }
                            `}
                        >
                            <LogIn size={18} />

                            {!collapsed && (
                                <span>
                                    Login
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </aside>

            {/* MOBILE MENU BUTTON */}

            <button
                onClick={onCloseMobile}
                className="
                    fixed
                    left-4
                    top-4
                    z-30
                    rounded-xl
                    border
                    border-white/10
                    bg-[#0A1930]
                    p-2
                    text-white
                    shadow-lg
                    md:hidden
                "
            >
                <Menu size={20} />
            </button>
        </>
    );
}