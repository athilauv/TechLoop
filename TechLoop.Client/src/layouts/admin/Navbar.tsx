import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

interface NavbarProps {
    onOpenMobileSidebar: () => void;
    sidebarCollapsed: boolean;
}

const Navbar = ({ onOpenMobileSidebar, sidebarCollapsed }: NavbarProps) => {
    const [profileOpen, setProfileOpen] = useState(false);
    // const { user } = useAuth();
    const user = { name: "Admin", role: "Admin" }; // ⚠️ placeholder
    const hasNotifications = true; // ⚠️ placeholder — wire to real notifications state

    return (
        <header
            className={`fixed right-0 top-0 z-20 flex h-20 items-center gap-4 border-b border-[#223A59] bg-[#0A0E17]/95 px-5 backdrop-blur transition-all duration-200 ease-out lg:px-8
            left-0 ${sidebarCollapsed ? "lg:left-[76px]" : "lg:left-[264px]"}`}
        >
            <button
                type="button"
                onClick={onOpenMobileSidebar}
                aria-label="Open menu"
                className="rounded-md p-2 text-[#8CA3BF] transition-colors hover:bg-[#12233B] hover:text-white lg:hidden"
            >
                <Menu size={20} />
            </button>

            <div className="relative hidden max-w-md flex-1 sm:block">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C7394]"
                />
                <input
                    type="text"
                    placeholder="Search technologies, content, questions..."
                    aria-label="Search"
                    className="w-full rounded-xl border border-[#223A59] bg-[#101C30] py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#5C7394] hover:border-[#223A59] focus:border-[#00E8C2] focus:ring-2 focus:ring-[#00E8C2]/20"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-lg p-2.5 text-[#8CA3BF] transition-colors hover:bg-[#12233B] hover:text-white"
                >
                    <Bell size={18} />
                    {hasNotifications && (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F87171]" />
                    )}
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileOpen((current) => !current)}
                        aria-haspopup="menu"
                        aria-expanded={profileOpen}
                        className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-[#12233B]"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00E8C2]/25 bg-[#00E8C2]/10 text-xs font-semibold text-[#00E8C2]">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-medium leading-tight text-white">{user.name}</p>
                            <p className="text-[11px] leading-tight text-[#5C7394]">{user.role}</p>
                        </div>
                        <ChevronDown size={14} className="text-[#5C7394]" />
                    </button>

                    {profileOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 top-12 z-30 w-44 overflow-hidden rounded-xl border border-[#223A59] bg-[#12233B] shadow-2xl"
                        >

                          <a  href="/admin/profile"
                            role="menuitem"
                            className="block px-3.5 py-2.5 text-sm text-[#8CA3BF] transition-colors hover:bg-[#101C30] hover:text-white"
                            >
                            Profile
                        </a>
                        <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3.5 py-2.5 text-left text-sm text-[#F87171] transition-colors hover:bg-[#F87171]/10"
                        >
                        Log out
                        </button>
                        </div>
                        )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;