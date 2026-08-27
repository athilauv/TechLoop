import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, logout } from "../../api/auth.api.ts";
import { getAdminUsers } from "../../api/admin.api.ts";
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
} from "lucide-react";

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapsed: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

interface NavItem {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    end?: boolean;
}

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


const NavSection = ({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) => (
    <div className="mb-6">
        {!collapsed && (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#5C7394]">
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
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                                isActive ? "border-[#00E8C2] bg-[#00E8C2]/10 text-[#00E8C2]" : "border-transparent text-[#8CA3BF] hover:bg-[#12233B] hover:text-white"
                            } ${collapsed ? "justify-center px-0" : ""}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                );
            })}
        </div>
    </div>
);

const Sidebar = ({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) => {
    const navigate = useNavigate();
    const { data: currentUser } = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser, staleTime: 5 * 60 * 1000 });
    const { data: adminUsers = [] } = useQuery({ queryKey: ["admin-users"], queryFn: getAdminUsers, staleTime: 5 * 60 * 1000 });
    const storedUsername = localStorage.getItem("username")?.trim() || localStorage.getItem("userName")?.trim();
    const currentAdmin = currentUser?.userId
        ? adminUsers.find((item) => item.id.toLowerCase() === currentUser.userId.toLowerCase())
        : undefined;
    const user = { name: currentAdmin?.username || storedUsername || "Admin", role: "Admin" };
    const handleLogout = async () => {
        try {
            await logout();
        } finally {
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
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#223A59] bg-[#0A0E17] transition-all duration-200 ease-out
                ${collapsed ? "w-[76px]" : "w-[264px]"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <div className="flex h-20 items-center justify-between border-b border-[#223A59] px-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00E8C2] text-sm font-bold text-[#081423]">
                            TL
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">TechLoop</p>
                                <p className="truncate text-[11px] text-[#5C7394]">Admin Console</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onToggleCollapsed}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="hidden shrink-0 rounded-md p-1.5 text-[#5C7394] transition-colors hover:bg-[#12233B] hover:text-white lg:block"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <NavSection title="Main" items={mainNav} collapsed={collapsed} />
                </nav>

                <div className="border-t border-[#223A59] p-3">
                    <div className={`flex items-center gap-3 rounded-lg p-2 ${collapsed ? "justify-center" : ""}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00E8C2]/25 bg-[#00E8C2]/10 text-sm font-semibold text-[#00E8C2]">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                                <p className="truncate text-[11px] text-[#5C7394]">{user.role}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="Log out"
                                className="shrink-0 rounded-md p-1.5 text-[#5C7394] transition-colors hover:bg-[#12233B] hover:text-[#F87171]"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;