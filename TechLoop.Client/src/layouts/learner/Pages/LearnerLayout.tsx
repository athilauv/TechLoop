import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { getLearnerProfile } from "../../../api/profile.api.ts";
import { logout } from "../../../api/auth.api.ts";
import type { UserProfile } from "../../../types/profile.types.ts";

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
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const scrollRef = useRef<HTMLDivElement>(null);

    const navHidden = useAutoHideNavbar(scrollRef);

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [learningCurriculumOpen, setLearningCurriculumOpen] = useState(false);

    const [user, setUser] = useState<UserProfile | null>(null);

    const isLearningPage =
        location.pathname.startsWith("/learner/learning");

    useEffect(() => {
        const loadUser = async () => {
            try {
                const profile = await getLearnerProfile();

                setUser(profile);

                if (profile.username) {
                    localStorage.setItem("username", profile.username);
                }
            } catch (error) {
                console.error(
                    "Unable to load current learner profile:",
                    error
                );
            }
        };

        void loadUser();
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(min-width:768px)");

        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setMobileOpen(false);
            }
        };

        mq.addEventListener("change", onChange);

        return () =>
            mq.removeEventListener("change", onChange);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();

            queryClient.removeQueries({ queryKey: ["current-user"] });
            localStorage.removeItem("username");

            setUser(null);
            setMobileOpen(false);

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const cssVars = {
        "--sidebar-width": collapsed
            ? SIDEBAR_COLLAPSED
            : SIDEBAR_EXPANDED,
    } as CSSProperties;

    const userInitial = user?.username
        ? user.username.charAt(0).toUpperCase()
        : "";

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
                isAuthenticated={!!user}
                userName={user?.username}
                userRole={user?.role}
                userInitials={userInitial}
                onLogout={handleLogout}
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
                    onMenuClick={() => {
                        if (isLearningPage) {
                            setLearningCurriculumOpen(true);
                            return;
                        }

                        setMobileOpen(true);
                    }}
                    username={user?.username}
                    role={user?.role}
                    initial={userInitial}
                />

                <main
                    ref={scrollRef}
                    className="h-full overflow-y-auto bg-[#081423]"
                    style={{
                        paddingTop: NAVBAR_HEIGHT,
                    }}
                >
                    {isLearningPage ? (
                        <div className="min-h-[calc(100vh-64px)] bg-[#081423]">
                            <Outlet
                                context={{
                                    learningCurriculumOpen,
                                    setLearningCurriculumOpen,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex min-h-full flex-col">
                            <div className="flex-1 px-4 py-4 md:px-6 lg:px-8">
                                <Outlet />
                            </div>

                            <Footer />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}