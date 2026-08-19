import { Outlet } from "react-router-dom";
import { useState } from "react";
import MentorSidebar from "../Sidebar.tsx";
import MentorNavbar from "../Navbar.tsx";

export default function MentorLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="content-studio-theme min-h-screen">
            <MentorSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed((value) => !value)}
            />

            <MentorNavbar
                collapsed={collapsed}
                onMenuClick={() => setCollapsed((value) => !value)}
            />

            <main
                className={[
                    "min-h-screen pt-16 transition-all duration-300",
                    collapsed ? "ml-20" : "ml-64",
                ].join(" ")}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}