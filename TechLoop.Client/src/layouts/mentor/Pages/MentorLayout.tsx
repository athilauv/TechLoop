import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import MentorSidebar from "../Sidebar.tsx";
import MentorNavbar from "../Navbar.tsx";
import Footer from "../Footer.tsx";

export default function MentorLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [navHidden, setNavHidden] = useState(false);
    const lastScroll = useRef(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            const current = el.scrollTop;
            const delta = current - lastScroll.current;

            if (current <= 80) setNavHidden(false);
            else if (delta > 8) setNavHidden(true);
            else if (delta < -8) setNavHidden(false);

            lastScroll.current = current;
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className="h-screen overflow-hidden bg-[#081423]"
            style={{
                "--sidebar-width": collapsed ? "72px" : "256px",
            } as React.CSSProperties}
        >
            <MentorSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed((value) => !value)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className="ml-0 h-screen transition-all duration-300 md:ml-[var(--sidebar-width)]">
                <MentorNavbar
                    hidden={navHidden}
                    collapsed={collapsed}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <main ref={scrollRef} className="h-full overflow-y-auto bg-[#081423] pt-16">
                    <div className="flex min-h-full flex-col">
                        <div className="flex-1 px-4 py-4 md:px-6 lg:px-8">
                            <Outlet />
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}
