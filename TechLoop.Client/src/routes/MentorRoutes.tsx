import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MentorLayout from "../layouts/mentor/Pages/MentorLayout";
import MentorLandingPage from "../features/mentor/landing/pages/MentorLandingPage";
import MentorDashboardPage from "../features/mentor/dashboard/Pages/MentorDashboardPage.tsx";
import MentorContentPage from "../features/mentor/content/pages/MentorContentPage.tsx";

export default function MentorRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
                {/* Mentor landing */}
                <Route index element={<MentorLandingPage />}/>

                {/* Mentor application */}
                <Route element={<MentorLayout />}>
                    <Route path="dashboard" element={<MentorDashboardPage />}/>
                    <Route path="content" element={<MentorContentPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}