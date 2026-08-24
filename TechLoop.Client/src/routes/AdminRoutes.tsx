import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import AdminLayout from "../layouts/admin/Pages/AdminLayout";
import AdminLandingPage from "../features/admin/landing/pages/AdminLandingPage";
import AdminLayout from "../layouts/admin/pages/AdminLayout.tsx";

// import AdminDashboardPage from "../features/admin/dashboard/pages/AdminDashboardPage.tsx";
//
// // ==================== TECHNOLOGIES ====================
//
// import TechnologyListPage
//     from "../features/admin/technologies/pages/TechnologyListPage.tsx";
//
// import TechnologyFormPage
//     from "../features/admin/technologies/pages/TechnologyFormPage.tsx";
//
// // ==================== CONTENT ====================
//
// import AdminContentPage
//     from "../features/admin/content/pages/AdminContentPage.tsx";
//
// // ==================== QUESTION MANAGEMENT ====================
//
// import QuestionTypePickerPage
//     from "../features/admin/questions/pages/QuestionTypePickerPage.tsx";
//
// import McqQuestionListPage
//     from "../features/admin/questions/pages/mcq/McqQuestionListPage.tsx";
//
// import McqQuestionDetailsPage
//     from "../features/admin/questions/pages/mcq/McqQuestionDetailsPage.tsx";
//
// import McqQuestionFormPage
//     from "../features/admin/questions/pages/mcq/McqQuestionFormPage.tsx";
//
// import CodingQuestionListPage
//     from "../features/admin/questions/pages/coding/CodingQuestionListPage.tsx";
//
// import CodingQuestionDetailsPage
//     from "../features/admin/questions/pages/coding/CodingQuestionDetailsPage.tsx";
//
// import CodingQuestionFormPage
//     from "../features/admin/questions/pages/coding/CodingQuestionFormPage.tsx";
// import {
//     MentorCommunityPage as AdminCommunityPage,
//     MentorCommunityPostPage as AdminCommunityPostPage,
// } from "../features/common/community/pages/routeWrappers.tsx";
// import UserManagementPage from "../features/admin/users/pages/UserManagementPage.tsx";


export default function AdminRoutes() {
    return (
        <Routes>

            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>

                <Route element={<AdminLayout />}>
                    {/* Admin Landing */}
                    <Route index element={<AdminLandingPage />}/>
                    {/*<Route path="dashboard" element={<AdminDashboardPage />}/>*/}
                    {/*<Route path="technologies" element={<TechnologyListPage />}/>*/}
                    {/*<Route path="technologies/new" element={<TechnologyFormPage />}/>*/}
                    {/*<Route path="technologies/:id/edit" element={<TechnologyFormPage />}/>*/}
                    {/*<Route path="content" element={<AdminContentPage />}/>*/}
                    {/*<Route path="questions" element={<QuestionTypePickerPage />}/>*/}
                    {/*<Route path="questions/mcq" element={<McqQuestionListPage />}/>*/}
                    {/*<Route path="questions/mcq/create" element={<McqQuestionFormPage />}/>*/}
                    {/*<Route path="questions/mcq/:id" element={<McqQuestionDetailsPage />}/>*/}
                    {/*<Route path="questions/mcq/:id/edit" element={<McqQuestionFormPage />}/>*/}
                    {/*<Route path="questions/coding" element={<CodingQuestionListPage />}/>*/}
                    {/*<Route path="questions/coding/create" element={<CodingQuestionFormPage />}/>*/}
                    {/*<Route path="questions/coding/:id" element={<CodingQuestionDetailsPage />}/>*/}
                    {/*<Route path="questions/coding/:id/edit" element={<CodingQuestionFormPage />}/>*/}
                    {/*<Route path="community" element={<AdminCommunityPage />}/>*/}
                    {/*<Route path="community/post/:postId" element={<AdminCommunityPostPage />}/>*/}
                    {/*<Route path="users" element={<UserManagementPage />}/>*/}

                </Route>
            </Route>

        </Routes>
    );
}