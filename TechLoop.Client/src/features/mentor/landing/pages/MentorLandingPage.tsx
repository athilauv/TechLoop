import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function MentorLandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}
            <header className="border-b border-white/10">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 font-bold text-slate-950">
                            TL
                        </div>

                        <div>
                            <p className="text-sm font-semibold">
                                TechLoop
                            </p>

                            <p className="text-xs text-slate-400">
                                Mentor Portal
                            </p>
                        </div>
                    </div>

                    {/* Dashboard button */}
                    <button
                        type="button"
                        onClick={() => navigate("/mentor/dashboard")}
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                    >
                        Mentor Dashboard
                        <ArrowRight size={16} />
                    </button>

                </div>
            </header>

            {/* Hero */}
            <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6">

                <div className="mx-auto max-w-3xl text-center">

                    <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                        TechLoop Mentor
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Help developers
                        <span className="text-cyan-400">
                            {" "}learn better.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                        Review learner contributions, improve learning
                        content, and help maintain the quality of the
                        TechLoop learning platform.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/mentor/dashboard")}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                        Enter Mentor Portal
                        <ArrowRight size={18} />
                    </button>

                </div>

            </main>
        </div>
    );
}