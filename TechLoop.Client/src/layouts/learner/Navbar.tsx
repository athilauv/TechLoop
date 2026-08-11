import { useMemo } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

interface NavbarProps {
    hidden?: boolean;
    onMenuClick: () => void;
}

export default function Navbar({
                                   hidden = false,
                                   onMenuClick,
                               }: NavbarProps) {

    const user = useMemo(() => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                return {
                    username: "",
                    initial: "",
                    role: "Learner",
                };
            }

            const payload = token.split(".")[1];

            if (!payload) {
                return {
                    username: "",
                    initial: "",
                    role: "Learner",
                };
            }

            const decodedPayload = JSON.parse(
                atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
            );

            const username =
                decodedPayload.username ||
                decodedPayload.unique_name ||
                decodedPayload.name ||
                "";

            const role =
                decodedPayload.role ||
                decodedPayload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ] ||
                "Learner";

            return {
                username,
                initial: username.charAt(0).toUpperCase(),
                role,
            };
        } catch {
            return {
                username: "",
                initial: "",
                role: "Learner",
            };
        }
    }, []);

    return (
        <header
            className={`
                fixed
                top-0
                right-0
                z-30
                h-16
                border-b
                border-white/5
                bg-[#0E192A]/95
                backdrop-blur-md
                transition-all
                duration-300
                md:left-[var(--sidebar-width)]
                ${
                hidden
                    ? "-translate-y-full"
                    : "translate-y-0"
            }
            `}
        >
            <div className="flex h-full items-center justify-between px-4 md:px-6">

                {/* Left */}

                <div className="flex items-center gap-3">

                    <button
                        onClick={onMenuClick}
                        className=" rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <h1 className="hidden text-lg font-semibold text-white lg:block">
                        TechLoop
                    </h1>

                </div>

                {/* Center */}

                <div className="hidden flex-1 justify-center px-8 md:flex">
                    <div className="relative w-full max-w-xl">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-500
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search technologies, topics, questions..."
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#081423]
                                pl-11
                                pr-4
                                text-sm
                                text-white
                                outline-none
                                transition
                                placeholder:text-slate-500
                                focus:border-[#17D4C3]
                            "
                        />

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-3">

                    <button
                        className="
                            relative
                            rounded-xl
                            p-2
                            text-slate-400
                            transition
                            hover:bg-white/10
                            hover:text-white
                        "
                    >
                        <Bell size={20} />

                        <span
                            className="
                                absolute
                                right-2
                                top-2
                                h-2
                                w-2
                                rounded-full
                                bg-[#17D4C3]
                            "
                        />
                    </button>

                    <button
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-2
                            py-1.5
                            transition
                            hover:bg-white/5
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-[#17D4C3]/20
                                font-semibold
                                text-[#17D4C3]
                            "
                        >
                            {user.initial}
                        </div>

                        <div className="hidden text-left lg:block">

                            <p className="text-sm font-medium text-white">
                                {user.username}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user.role}
                            </p>

                        </div>

                        <ChevronDown
                            size={16}
                            className="hidden text-slate-500 lg:block"
                        />

                    </button>

                </div>

            </div>
        </header>
    );
}