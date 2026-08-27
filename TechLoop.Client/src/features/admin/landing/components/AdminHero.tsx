import { Link } from "react-router-dom";
import { Boxes, FileText, ListChecks, Sparkles } from "lucide-react";
import { useScrollReveal } from "../../../../hooks/useScrollReveal.ts";

const AdminHero = () => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

    return (
        <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-20">
<div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                <div
                    className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px]"
                    style={{ background: "#00E8C2" }}
                />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#8CA3BF 1px, transparent 1px), linear-gradient(90deg, #8CA3BF 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        maskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
                    }}
                />
            </div>

            <div
                ref={ref}
                className={`mx-auto max-w-4xl text-center transition-all duration-700 ease-out ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
            >
                <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#223A59] bg-[#12233B]/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#00E8C2]">
                    <Sparkles size={13} />
                    Admin Control Center
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Welcome back, <span className="text-[#00E8C2]">Admin</span>
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#8CA3BF] sm:text-lg">
                    Manage, organize, and grow the TechLoop developer learning ecosystem —
                    technologies, content, coding challenges, and community, all in one place.
                </p>

                <div
                    className={`mt-9 flex flex-wrap items-center justify-center gap-3 transition-all delay-150 duration-700 ease-out ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    <Link
                        to="/admin/technologies"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00E8C2] px-5 py-3 text-sm font-semibold text-[#081423] transition-all duration-150 hover:bg-[#00B89A] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
                    >
                        <Boxes size={16} />
                        Manage Technologies
                    </Link>
                    <Link
                        to="/admin/content"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#223A59] bg-transparent px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-[#00E8C2]/40 hover:bg-[#12233B] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
                    >
                        <FileText size={16} />
                        Manage Content
                    </Link>
                    <Link
                        to="/admin/questions"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#223A59] bg-transparent px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-[#00E8C2]/40 hover:bg-[#12233B] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
                    >
                        <ListChecks size={16} />
                        Manage Questions
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AdminHero;
