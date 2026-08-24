import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.tsx";
import Navbar from "../Navbar.tsx";
import Footer from "../Footer.tsx";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0A0E17]">
            <Sidebar
                collapsed={collapsed}
                onToggleCollapsed={() => setCollapsed((current) => !current)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <Navbar
                onOpenMobileSidebar={() => setMobileOpen(true)}
                sidebarCollapsed={collapsed}
            />

            <div
                className={`flex min-h-screen flex-col pt-20 transition-all duration-200 ease-out
                ${collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"}`}
            >
                <main className="flex-1">
                    <Outlet />
                </main>

                <Footer sidebarCollapsed={collapsed} />
            </div>
        </div>
    );
};

export default AdminLayout;