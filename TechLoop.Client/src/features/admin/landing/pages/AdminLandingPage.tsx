import AdminHero from "../components/AdminHero.tsx";
import PlatformOverview from "../components/PlatformOverview.tsx";
import PlatformStatsSection from "../components/PlatformStatsSection.tsx";
import QuickActions from "../components/QuickActions.tsx";
import RecentActivity from "../components/RecentActivity.tsx";
import AdminLandingClosing from "../components/AdminLandingClosing.tsx";
import { useAdminLandingData } from "../../../../hooks/useAdminLandingData.ts";

const AdminLandingPage = () => {
    const { stats, recentActivity, isLoading } = useAdminLandingData();

    return (
        <div className="min-h-screen bg-[#0A0E17]">
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
