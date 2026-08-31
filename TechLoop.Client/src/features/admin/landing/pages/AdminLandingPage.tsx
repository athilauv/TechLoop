import AdminHero from "../components/AdminHero.tsx";
import PlatformOverview from "../components/PlatformOverview.tsx";
import PlatformStatsSection from "../components/PlatformStatsSection.tsx";
import QuickActions from "../components/QuickActions.tsx";
import RecentActivity from "../components/RecentActivity.tsx";
import AdminLandingClosing from "../components/AdminLandingClosing.tsx";
import { useAdminLandingData } from "../../../../hooks/useAdminLandingData.ts";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#8CA3BF] transition-colors duration-150 hover:bg-[#00E8C2]/10 hover:text-[#00E8C2] focus:outline-none focus:ring-2 focus:ring-[#00E8C2]/40"
        >
            <ArrowLeft size={16} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Back</span>
        </button>
    );
};

const AdminLandingPage = () => {
    const { stats, recentActivity, isLoading } = useAdminLandingData();

    return (
        <div className="min-h-screen bg-[#0A0E17]">
            <div className="flex justify-end px-6 pt-5 lg:px-10">
                <BackButton />
            </div>
            <AdminHero />
            <PlatformOverview />
            <PlatformStatsSection stats={stats} isLoading={isLoading} />
            <QuickActions />
            <RecentActivity items={recentActivity} isLoading={isLoading} />
            <AdminLandingClosing />
        </div>
    );
};

export default AdminLandingPage;
