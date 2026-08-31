import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.tsx";
import Navbar from "../Navbar.tsx";
import Footer from "../Footer.tsx";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-[#081423]">
            <Sidebar
                collapsed={collapsed}
                onToggleCollapsed={() => setCollapsed((current) => !current)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div
                className={[
                    "h-screen min-w-0 transition-all duration-300",
                    collapsed ? "ml-0 md:ml-[72px]" : "ml-0 md:ml-64",
                ].join(" ")}
            >
                <Navbar
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                    sidebarCollapsed={collapsed}
                />

                <main className="h-full overflow-x-hidden overflow-y-auto bg-[#081423] pt-16">
                    <div className="flex min-h-full flex-col">
                        <div className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:px-8">
                            <Outlet />
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;