import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../../../hooks/useScrollReveal.ts";

const AdminLandingClosing = () => {
    const { ref, inView } = useScrollReveal<HTMLDivElement>();

    return (
        <section className="relative overflow-hidden px-6 py-20 lg:px-10">
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-64 w-[480px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[100px]"
                style={{ background: "#00E8C2" }}
                aria-hidden="true"
            />

            <div
                ref={ref}
                className={`relative mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
            >
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    TechLoop — built for developers, by developers
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#8CA3BF] sm:text-base">
                    Keep the ecosystem healthy: fresh technologies, well-structured content,
                    and an active community.
                </p>
                <Link
                    to="/admin/dashboard"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#223A59] bg-[#12233B] px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-[#00E8C2]/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E8C2]/40"
                >
                    Go to full dashboard
                    <ArrowRight size={15} />
                </Link>
            </div>
        </section>
    );
};

export default AdminLandingClosing;
