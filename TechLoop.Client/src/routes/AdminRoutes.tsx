import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/admin/pages/AdminLayout.tsx";
import AdminLandingPage from "../features/admin/landing/pages/AdminLandingPage";
import AdminDashboardPage from "../features/admin/dashboard/pages/AdminDashboardPage.tsx";
import AdminTechnologiesPage from "../features/admin/technologies/pages/AdminTechnologiesPage.tsx";
import AdminTechnologyFormPage from "../features/admin/technologies/pages/AdminTechnologyFormPage.tsx";
import AdminTechnologyCategoriesPage from "../features/admin/categories/pages/AdminTechnologyCategoriesPage.tsx";
import AdminContentPage from "../features/admin/content/pages/AdminContentPage.tsx";
import AdminQuestionsPage from "../features/admin/questions/pages/AdminQuestionsPage.tsx";
import AdminCommunityPage from "../features/admin/community/pages/AdminCommunityPage.tsx";
import AdminMentorsPage from "../features/admin/mentors/pages/AdminMentorsPage.tsx";
import AdminMentorOverviewPage from "../features/admin/mentors/pages/AdminMentorOverviewPage.tsx";
import AdminUsersPage from "../features/admin/users/pages/AdminUsersPage.tsx";
import AdminPendingContributionsPage from "../features/admin/contributions/pages/AdminPendingContributionsPage.tsx";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminLandingPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="technologies" element={<AdminTechnologiesPage />} />
                    <Route path="technologies/new" element={<AdminTechnologyFormPage />} />
                    <Route path="technologies/:id/edit" element={<AdminTechnologyFormPage />} />
                    <Route path="technology-categories" element={<AdminTechnologyCategoriesPage />} />
                    <Route path="content" element={<AdminContentPage />} />
                    <Route path="questions" element={<AdminQuestionsPage />} />
                    <Route path="community" element={<AdminCommunityPage />} />
                    <Route path="mentors" element={<AdminMentorsPage />} />
                    <Route path="mentors/:id" element={<AdminMentorOverviewPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="contributions" element={<AdminPendingContributionsPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
