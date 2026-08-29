import { NavLink, useNavigate } from "react-router-dom";
import { useMentorPendingQueue } from "../../hooks/useMentorPendingQueue.ts";
import { getMentorPendingCount } from "../../types/mentorPending.types.ts";
import {
    LayoutDashboard,
    GitPullRequest,
    MessagesSquare,
    BookOpen,
    Code2,
    ClipboardList,
    User,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth.api.ts";

interface MentorSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

type NavItem = {
    label: string;
    path: string;
    icon: LucideIcon;
    badge?: number;
};

function SidebarItem({
    label,
    path,
    icon: Icon,
    collapsed,
    badge,
    onCloseMobile,
}: NavItem & {
    collapsed: boolean;
    onCloseMobile: () => void;
}) {
    return (
        <NavLink
            to={path}
            onClick={onCloseMobile}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
                [
                    "group relative flex items-center rounded-xl px-3 py-3 text-sm transition-all duration-200",
                    collapsed ? "justify-center" : "gap-3",
                    isActive
                        ? "bg-[#17D4C3]/15 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
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
                        <span className="min-w-0 flex-1 truncate font-medium">
                            {label}
                        </span>
                    )}
                    {badge !== undefined && badge > 0 && (
                        <span
                            className={[
                                "flex shrink-0 items-center justify-center rounded-full bg-[#17D4C3]/15 px-2 py-0.5 text-xs font-semibold text-[#17D4C3]",
                                collapsed ? "absolute right-1 top-1 min-w-4 h-4 px-0 text-[9px]" : "",
                            ].join(" ")}
                            aria-label={`${badge} pending`}
                        >
                            {badge > 99 ? "99+" : badge}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
}

function Section({
    title,
    items,
    collapsed,
    onCloseMobile,
}: {
    title: string;
    items: NavItem[];
    collapsed: boolean;
    onCloseMobile: () => void;
}) {
    return (
        <div className="mb-7">
            {!collapsed && (
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {title}
                </p>
            )}
            <div className="space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.path}
                        {...item}
                        collapsed={collapsed}
                        onCloseMobile={onCloseMobile}
                    />
                ))}
            </div>
        </div>
    );
}

export default function MentorSidebar({
    collapsed,
    onToggle,
    mobileOpen,
    onCloseMobile,
}: MentorSidebarProps) {
    const { data: pendingQueue } = useMentorPendingQueue();

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const contributionCount = pendingQueue?.pendingContributions.length ?? 0;
    const pendingCount = getMentorPendingCount(pendingQueue);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            queryClient.removeQueries({ queryKey: ["current-user"] });
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            navigate("/login", { replace: true });
        }
    };

    const mainItems: NavItem[] = [
        { label: "Dashboard", path: "/mentor/dashboard", icon: LayoutDashboard },
        { label: "Contributions", path: "/mentor/contributions", icon: GitPullRequest, badge: contributionCount },
        { label: "Community", path: "/mentor/community", icon: MessagesSquare },
    ];

    const contentItems: NavItem[] = [
        { label: "Content", path: "/mentor/content", icon: BookOpen },
        { label: "Pending", path: "/mentor/pending", icon: ClipboardList, badge: pendingCount },
        { label: "Questions", path: "/mentor/questions", icon: Code2 },
    ];

    const accountItems: NavItem[] = [
        { label: "Profile", path: "/mentor/profile", icon: User },
    ];

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#0A1930] transition-all duration-300",
                    collapsed ? "w-[72px]" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                ].join(" ")}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-4">
                    <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17D4C3] font-bold text-[#081423]">
                            TL
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="text-sm font-semibold text-white">TechLoop</h1>
                                <p className="text-xs text-slate-500">Mentor</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white md:flex"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    <button
                        type="button"
                        onClick={onCloseMobile}
                        aria-label="Close menu"
                        className="rounded-lg p-2 text-slate-400 md:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <Section title="MAIN" items={mainItems} collapsed={collapsed} onCloseMobile={onCloseMobile} />
                    <Section title="CONTENT" items={contentItems} collapsed={collapsed} onCloseMobile={onCloseMobile} />
                    <Section title="ACCOUNT" items={accountItems} collapsed={collapsed} onCloseMobile={onCloseMobile} />
                </nav>

                <div className="border-t border-white/5 p-4">
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                            M
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">Mentor</p>
                                <p className="truncate text-xs text-slate-500">Mentor Account</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Log out"
                        className={`mt-3 flex w-full items-center rounded-xl py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 ${
                            collapsed ? "justify-center px-0" : "gap-3 px-3"
                        }`}
                    >
                        <LogOut size={18} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Open menu"
                    className="fixed left-4 top-4 z-30 rounded-xl border border-white/10 bg-[#0A1930] p-2 text-white shadow-lg md:hidden"
                >
                    <Menu size={20} />
                </button>
            </aside>
        </>
    );
}
