import { useState } from "react";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/auth.api.ts";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    onOpenMobileSidebar: () => void;
    sidebarCollapsed: boolean;
}

const Navbar = ({
    onOpenMobileSidebar,
    sidebarCollapsed,
}: NavbarProps) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const { data: currentUser } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    // The admin navbar must never inherit a learner/mentor name or initial
    // from stale localStorage data. Admin is represented by "A".
    const isAdmin =
        currentUser?.roleId === 3 ||
        currentUser?.role?.trim().toLowerCase() === "admin";

    const name = isAdmin ? "Admin" : "Admin";
    const initial = "A";

    return (
        <header
            className={[
                "fixed inset-x-0 top-0 z-30 h-16 border-b border-white/5 bg-[#0E192A]/95 backdrop-blur-md transition-all duration-300",
                sidebarCollapsed
                    ? "md:left-[72px]"
                    : "md:left-64",
            ].join(" ")}
        >
            <div className="flex h-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
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
                            placeholder="Search technologies, content, questions..."
                            aria-label="Search"
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#081423] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#17D4C3]"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen((value) => !value)
                            }
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17D4C3]/20 font-semibold text-[#17D4C3]">
                                {initial}
                            </div>

                            <div className="hidden text-left lg:block">
                                <p className="text-sm font-medium text-white">
                                    {name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Admin
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className="hidden text-slate-500 lg:block"
                            />
                        </button>

                        {profileOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0A1930] shadow-2xl"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/admin/dashboard")
                                    }
                                    role="menuitem"
                                    className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white"
                                >
                                    Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
