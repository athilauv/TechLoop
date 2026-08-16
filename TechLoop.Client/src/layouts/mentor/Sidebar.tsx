import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    GitPullRequest,
    MessagesSquare,
    Cpu,
    BookOpen,
    Layers3,
    GraduationCap,
    Code2,
    Bell,
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

const contentItems = [
    {
        label: "Technologies",
        path: "/mentor/technologies",
        icon: Cpu,
    },
    {
        label: "Topics",
        path: "/mentor/topics",
        icon: BookOpen,
    },
    {
        label: "SubTopics",
        path: "/mentor/subtopics",
        icon: Layers3,
    },
    {
        label: "Curriculum",
        path: "/mentor/curriculum",
        icon: GraduationCap,
    },
    {
        label: "Questions",
        path: "/mentor/questions",
        icon: Code2,
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
                     }: {
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
    collapsed: boolean;
}) {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                [
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    collapsed
                        ? "justify-center"
                        : "gap-3",
                    isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
            }
            title={collapsed ? label : undefined}
        >
            <Icon size={18} strokeWidth={1.8} />

            {!collapsed && (
                <span className="truncate">
                    {label}
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
    items: typeof mainItems;
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
                    items={mainItems}
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