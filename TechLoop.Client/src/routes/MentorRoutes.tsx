import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MentorLayout from "../layouts/mentor/Pages/MentorLayout";
import MentorLandingPage from "../features/mentor/landing/pages/MentorLandingPage";
import MentorDashboardPage from "../features/mentor/dashboard/Pages/MentorDashboardPage.tsx";
import MentorContentPage from "../features/mentor/content/pages/MentorContentPage.tsx";
import MentorProfile from "../features/mentor/profile/pages/MentorProfile.tsx";
import MentorTopicContributionsPage from "../features/mentor/topic-contribution/pages/MentorTopicContributionsPage.tsx";
import MentorTopicContributionDetailsPage from "../features/mentor/topic-contribution/pages/MentorTopicContributionDetailsPage.tsx";
import MentorCommunityPage from "../features/mentor/community/pages/MentorCommunityPage.tsx";

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
                    <Route path="profile" element={<MentorProfile />}/>
                    <Route path="contributions" element={<MentorTopicContributionsPage />}/>
                    <Route path="topic-contributions/:id" element={<MentorTopicContributionDetailsPage />}/>
                    <Route path="community" element={<MentorCommunityPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}