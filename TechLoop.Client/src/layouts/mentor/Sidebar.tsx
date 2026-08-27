import { NavLink } from "react-router-dom";
import { useMentorPendingQueue } from "../../hooks/useMentorPendingQueue.ts";
import { getMentorPendingCount } from "../../types/mentorPending.types.ts";
import {
    LayoutDashboard,
    GitPullRequest,
    MessagesSquare,
    BookOpen,
    Code2,
    Bell,
    ClipboardList,
    User,
    ChevronLeft,
} from "lucide-react";

interface MentorSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const mainItems = [
    {
        label: "Dashboard",
        path: "/mentor/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Contributions",
        path: "/mentor/contributions",
        icon: GitPullRequest,
    },
    {
        label: "Community",
        path: "/mentor/community",
        icon: MessagesSquare,
    },
];

const insightItems = [
    {
        label: "Notifications",
        path: "/mentor/notifications",
        icon: Bell,
    },
];

const accountItems = [
    {
        label: "Profile",
        path: "/mentor/profile",
        icon: User,
    },
];

function SidebarItem({
                         label,
                         path,
                         icon: Icon,
                         collapsed,
                         badge,
                     }: {
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
    collapsed: boolean;
    badge?: number;
}) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                [
                    "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    collapsed ? "justify-center" : "gap-3",
                    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
            }
            title={collapsed ? label : undefined}
        >
            <Icon size={18} strokeWidth={1.8} />

            {!collapsed && (
                <span className="min-w-0 flex-1 truncate">
                    {label}
                </span>
            )}

            {badge !== undefined && badge > 0 && (
                <span
                    className={[
                        "flex shrink-0 items-center justify-center rounded-full",
                        "bg-cyan-500 px-1.5 text-[10px] font-bold text-slate-950",
                        collapsed ? "absolute right-1 top-1 min-w-4 h-4" : "min-w-5 h-5",
                    ].join(" ")}
                    aria-label={`${badge} pending`}
                >
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </NavLink>
    );
}

function Section({
                     title,
                     items,
                     collapsed,
                 }: {
    title: string;
    items: Array<{
        label: string;
        path: string;
        icon: typeof LayoutDashboard;
        badge?: number;
    }>;
    collapsed: boolean;
}) {
    return (
        <div className="space-y-2">
            {!collapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {title}
                </p>
            )}

            <div className="space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.path}
                        {...item}
                        collapsed={collapsed}
                    />
                ))}
            </div>
        </div>
    );
}

export default function MentorSidebar({
                                          collapsed,
                                          onToggle,
                                      }: MentorSidebarProps) {
    const { data: pendingQueue } = useMentorPendingQueue();

    const contributionCount =
        pendingQueue?.pendingContributions.length ?? 0;

    const pendingCount = getMentorPendingCount(pendingQueue);

    const displayMainItems = mainItems.map((item) =>
        item.label === "Contributions"
            ? { ...item, badge: contributionCount }
            : item,
    );

    const contentItems = [
        {
            label: "Content",
            path: "/mentor/content",
            icon: BookOpen,
        },
        {
            label: "Pending",
            path: "/mentor/pending",
            icon: ClipboardList,
            badge: pendingCount,
        },
        {
            label: "Questions",
            path: "/mentor/questions",
            icon: Code2,
        },
    ];

    return (
        <aside
            className={[
                "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-[#0A1930] transition-all duration-300",
                collapsed ? "w-20" : "w-64",
            ].join(" ")}
        >
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                <div
                    className={[
                        "flex items-center",
                        collapsed ? "justify-center w-full" : "gap-3",
                    ].join(" ")}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500 font-bold text-slate-950">
                        TL
                    </div>

                    {!collapsed && (
                        <div>
                            <p className="text-sm font-semibold text-white">
                                TechLoop
                            </p>

                            <p className="text-xs text-slate-500">
                                Mentor
                            </p>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                <Section
                    title="Main"
                    items={displayMainItems}
                    collapsed={collapsed}
                />

                <Section
                    title="Content"
                    items={contentItems}
                    collapsed={collapsed}
                />

                <Section
                    title="Insights"
                    items={insightItems}
                    collapsed={collapsed}
                />

                <Section
                    title="Account"
                    items={accountItems}
                    collapsed={collapsed}
                />
            </nav>

            {/* User */}
            <div className="shrink-0 border-t border-white/10 p-3">
                <div
                    className={[
                        "flex items-center rounded-lg bg-white/5 p-2",
                        collapsed
                            ? "justify-center"
                            : "gap-3",
                    ].join(" ")}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-slate-950">
                        M
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                Mentor
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                Mentor Account
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}