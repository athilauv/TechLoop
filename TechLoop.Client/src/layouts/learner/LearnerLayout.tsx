import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function useAutoHideNavbar(scrollRef: React.RefObject<HTMLDivElement | null>) {
    const [hidden, setHidden] = useState(false);
    const lastScroll = useRef(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScroll = () => {
            const current = el.scrollTop;
            const delta = current - lastScroll.current;

            if (current <= 80) {
                setHidden(false);
            } else if (delta > 8) {
                setHidden(true);
            } else if (delta < -8) {
                setHidden(false);
            }

            lastScroll.current = current;
        };

        el.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            el.removeEventListener("scroll", onScroll);
        };
    }, [scrollRef]);

    return hidden;
}

export default function LearnerLayout() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hidden = useAutoHideNavbar(scrollRef);

    return (
        <div className="h-screen bg-[#081423] overflow-hidden">

            <Navbar hidden={hidden} />

            <Sidebar />

            <div className="ml-64 pt-16 h-screen">

                <div ref={scrollRef} className="h-full overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1440px] px-8 py-8">
                        <Outlet />
                    </div>
                    <Footer />
                </div>

            </div>
        </div>
    );
}