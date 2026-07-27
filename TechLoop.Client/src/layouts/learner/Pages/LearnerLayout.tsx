import { Outlet, useLocation } from "react-router-dom";
import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
} from "react";

import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const SIDEBAR_EXPANDED = "256px";
const SIDEBAR_COLLAPSED = "72px";
const NAVBAR_HEIGHT = 64;

function useAutoHideNavbar(
    scrollRef: React.RefObject<HTMLDivElement | null>
) {
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

        el.addEventListener("scroll", onScroll, {
            passive: true,
        });

        return () => {
            el.removeEventListener("scroll", onScroll);
        };
    }, [scrollRef]);

    return hidden;
}

export default function LearnerLayout() {
    const location = useLocation();

    const scrollRef = useRef<HTMLDivElement>(null);

    const navHidden = useAutoHideNavbar(scrollRef);

    const [collapsed, setCollapsed] =
        useState(false);

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const isLearningPage =
        location.pathname.startsWith(
            "/learner/learning"
        );

    useEffect(() => {
        const mq = window.matchMedia(
            "(min-width:768px)"
        );

        const onChange = (
            e: MediaQueryListEvent
        ) => {
            if (e.matches) {
                setMobileOpen(false);
            }
        };

        mq.addEventListener(
            "change",
            onChange
        );

        return () =>
            mq.removeEventListener(
                "change",
                onChange
            );
    }, []);

    const cssVars = {
        "--sidebar-width": collapsed
            ? SIDEBAR_COLLAPSED
            : SIDEBAR_EXPANDED,
    } as CSSProperties;

    return (
        <div
            style={cssVars}
            className="
                h-screen
                overflow-hidden
                bg-[#081423]
            "
        >
            <Sidebar
                collapsed={collapsed}
                onToggleCollapse={() =>
                    setCollapsed((v) => !v)
                }
                mobileOpen={mobileOpen}
                onCloseMobile={() =>
                    setMobileOpen(false)
                }
            />

            <div
                className="
                    ml-0
                    h-screen
                    transition-all
                    duration-300
                    md:ml-[var(--sidebar-width)]
                "
            >
                <Navbar
                    hidden={navHidden}
                    onMenuClick={() =>
                        setMobileOpen(true)
                    }
                />

                <main
                    ref={scrollRef}
                    className="
                        h-full
                        overflow-y-auto
                        bg-[#081423]
                    "
                    style={{
                        paddingTop:
                        NAVBAR_HEIGHT,
                    }}
                >
                    {isLearningPage ? (
                        <div
                            className="
                                min-h-[calc(100vh-64px)]
                                bg-[#081423]
                            "
                        >
                            <Outlet />
                        </div>
                    ) : (
                        <>
                            <div
                                className="
                                    px-4
                                    py-4
                                    md:px-6
                                    lg:px-8
                                "
                            >
                                <Outlet />
                            </div>

                            <Footer />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}