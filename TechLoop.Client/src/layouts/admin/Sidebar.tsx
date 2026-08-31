import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth.api.ts";
import {
    LayoutDashboard,
    Boxes,
    Layers,
    FileText,
    ListChecks,
    MessagesSquare,
    GraduationCap,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapsed: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
    end?: boolean;
};

const mainNav: NavItem[] = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/technologies", label: "Technologies", icon: Boxes },
    { to: "/admin/technology-categories", label: "Technology Categories", icon: Layers },
    { to: "/admin/content", label: "Content", icon: FileText },
    { to: "/admin/questions", label: "Questions", icon: ListChecks },
    { to: "/admin/community", label: "Community", icon: MessagesSquare },
    { to: "/admin/mentors", label: "Mentors", icon: GraduationCap },
    { to: "/admin/users", label: "Users", icon: Users },
];

function NavSection({
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
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onCloseMobile}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                [
                                    "group flex items-center rounded-xl px-3 py-3 text-sm transition-all duration-200",
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
                                        <span className="flex-1 truncate font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}

const Sidebar = ({
                     collapsed,
                     onToggleCollapsed,
                     mobileOpen,
                     onCloseMobile,
                 }: SidebarProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const user = { name: "Admin", role: "Admin" };

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
                    "fixed inset-y-0 left-0 z-50 flex max-w-[85vw] flex-col border-r border-white/5 bg-[#0A1930] transition-all duration-300",
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
                                <p className="text-xs text-slate-500">Admin Console</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onToggleCollapsed}
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
                    <NavSection
                        title="MAIN"
                        items={mainNav}
                        collapsed={collapsed}
                        onCloseMobile={onCloseMobile}
                    />
                </nav>

                <div className="border-t border-white/5 p-4">
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                            A
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">{user.name}</p>
                                <p className="truncate text-xs text-slate-500">{user.role}</p>
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
            </aside>
        </>
    );
};

export default Sidebar;