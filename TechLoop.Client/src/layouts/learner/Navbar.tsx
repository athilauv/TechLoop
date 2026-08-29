import { Menu, Search, ChevronDown } from "lucide-react";

interface NavbarProps {
    hidden?: boolean;
    onMenuClick: () => void;
    username?: string;
    role?: string;
    initial?: string;
}

export default function Navbar({
    hidden = false,
    onMenuClick,
    username = "",
    role = "Learner",
    initial = "",
}: NavbarProps) {
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

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            hover:bg-white/10
                            hover:text-white
                            md:hidden
                        "
                    >
                        <Menu size={20} />
                    </button>

                    <h1 className="hidden text-lg font-semibold text-white lg:block">
                        TechLoop
                    </h1>

                </div>

                {/* CENTER SEARCH */}
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

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* User */}
                    <button
                        type="button"
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
                        {/* Initial */}
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
                            {initial || "U"}
                        </div>

                        {/* Username + Role */}
                        <div className="hidden text-left lg:block">

                            <p className="text-sm font-medium text-white">
                                {username || "User"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {role}
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

