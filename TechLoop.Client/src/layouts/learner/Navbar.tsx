import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Plus, User, Settings, LogOut,} from "lucide-react";
import { logout } from "../../../services/authService.ts";
import { useNavigate } from "react-router-dom";
import { showToast} from "../../../utils/toast.ts";

interface NavbarProps {
    hidden?: boolean;
    userName?: string;
    userInitials?: string;
    notificationCount?: number;
    onSearch?: (query: string) => void;
    onQuickAction?: () => void;
    onOpenNotifications?: () => void;
    onOpenProfile?: () => void;
    onOpenSettings?: () => void;
    onLogout?: () => void;
}

const ROUTE_TITLE_MAP: Record<string, string> = {
    dashboard: "Dashboard",
    home: "Home",
    learn: "Learn",
    practice: "Practice",
    coding: "Coding",
    classrooms: "Classrooms",
    community: "Community",
    messages: "Messages",
    "ai-mentor": "AI Mentor",
    analytics: "Analytics",
    leaderboard: "Leaderboard",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
};

function getPageTitle(pathname: string): string {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) return "Dashboard";

    return (
        ROUTE_TITLE_MAP[lastSegment] ??

        lastSegment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
}

export default function Navbar({
                                   hidden = false,
                                   userName = "Arjun Mehta",
                                   userInitials = "AM",
                                   notificationCount = 3,
                                   onSearch,
                                   onQuickAction,
                                   onOpenNotifications,
                                   onOpenProfile,
                                   onOpenSettings,
                               }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const pageTitle = useMemo(
        () => getPageTitle(location.pathname),
        [location.pathname]
    );

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const result = await logout();

            showToast.success(result.Message || "Logged out successfully.");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 500);
        } catch (error) {
            showToast.error("Logout failed.");
        }
    };


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className={`
                fixed
                top-0
                left-0
                md:left-64
                right-0
                h-16
                z-50
                bg-[#0A1930]/90
                backdrop-blur-xl
                border-b
                border-white/5
                transition-transform
                duration-300
                ${hidden ? "-translate-y-full" : "translate-y-0"}
            `}
        >
            <div className="h-full px-3 sm:px-4 md:px-6 flex items-center gap-2 sm:gap-4 md:gap-6">

                {/* Left: Page Title */}

                <div className="flex items-center gap-2 text-sm text-slate-400 shrink-0">
                    <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                        {pageTitle}
                    </span>
                </div>

                {/* Center: Search Bar */}

                <div className="flex-1 flex justify-center min-w-0">

                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                        <input
                            type="text"
                            placeholder="Search topics, problems..."
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="
                                w-full
                                bg-[#11243A]
                                border
                                border-white/5
                                rounded-xl
                                pl-10
                                pr-4
                                py-2.5
                                text-sm
                                text-white
                                placeholder:text-slate-500
                                focus:outline-none
                                focus:border-[#17D4C3]/50
                            "
                        />

                    </div>

                </div>

                {/* Right: Actions */}

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    <button
                        onClick={onQuickAction}
                        className="
                            hidden
                            md:flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#17D4C3]
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-[#081423]
                            hover:opacity-90
                        "
                    >
                        <Plus size={16} />
                        New
                    </button>

                    <button
                        onClick={onOpenNotifications}
                        className="
                            relative
                            h-10
                            w-10
                            rounded-xl
                            border
                            border-white/5
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:text-[#17D4C3]
                            shrink-0
                        "
                    >
                        <Bell size={18} />

                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                        )}
                    </button>

                    <div
                        ref={menuRef}
                        className="relative"
                    >
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/5"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#17D4C3]/20 text-[#17D4C3] flex items-center justify-center font-semibold shrink-0">
                                {userInitials}
                            </div>

                            <ChevronDown
                                size={16}
                                className={`hidden sm:block transition ${
                                    menuOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#11243A] border border-white/5 overflow-hidden shadow-xl">

                                <div className="p-4 border-b border-white/5">
                                    <p className="text-white font-medium">
                                        {userName}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        View profile
                                    </p>
                                </div>

                                <button
                                    onClick={onOpenProfile}
                                    className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5"
                                >
                                    <User size={16} />
                                    Profile
                                </button>

                                <button
                                    onClick={onOpenSettings}
                                    className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </header>
    );
}