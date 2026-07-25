import { MessageSquare, Mail } from "lucide-react";

const footerLinks = [
    {
        title: "Platform",
        links: [
            "Learn",
            "Practice",
            "Coding",
            "AI Mentor",
        ],
    },
    {
        title: "Resources",
        links: [
            "Documentation",
            "API",
            "Community",
            "Blog",
        ],
    },
    {
        title: "Company",
        links: [
            "About",
            "Privacy",
            "Terms",
            "Contact",
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0A1930]">
            <div className="mx-auto max-w-[1440px] px-8 py-10">

                <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">

                    {/* Brand */}

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17D4C3] font-bold text-[#081423]">
                                TL
                            </div>

                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    TechLoop
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Learn • Practice • Build
                                </p>

                            </div>

                        </div>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                            A modern learning platform for developers to master
                            technologies, solve coding challenges, collaborate
                            with the community, and accelerate career growth.
                        </p>

                        <div className="mt-6 flex gap-3">

                            {/*<button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-slate-400 transition hover:border-[#17D4C3]/30 hover:text-[#17D4C3]">*/}
                            {/*    <Github size={18} />*/}
                            {/*</button>*/}

                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-slate-400 transition hover:border-[#17D4C3]/30 hover:text-[#17D4C3]">
                                <MessageSquare size={18} />
                            </button>

                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-slate-400 transition hover:border-[#17D4C3]/30 hover:text-[#17D4C3]">
                                <Mail size={18} />
                            </button>

                        </div>

                    </div>

                    {footerLinks.map((section) => (

                        <div key={section.title}>

                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                                {section.title}
                            </h3>

                            <ul className="space-y-3">

                                {section.links.map((link) => (

                                    <li key={link}>

                                        <a
                                            href="#"
                                            className="text-sm text-slate-400 transition hover:text-[#17D4C3]"
                                        >
                                            {link}
                                        </a>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    ))}

                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-sm text-slate-500 md:flex-row">

                    <p>
                        © {new Date().getFullYear()} TechLoop. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                        <span>
                            All systems operational
                        </span>

                    </div>

                </div>

            </div>
        </footer>
    );
}