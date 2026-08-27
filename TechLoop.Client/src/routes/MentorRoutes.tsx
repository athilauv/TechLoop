import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import MentorLayout from "../layouts/mentor/Pages/MentorLayout";

import MentorLandingPage
    from "../features/mentor/landing/pages/MentorLandingPage";

import MentorDashboardPage
    from "../features/mentor/dashboard/Pages/MentorDashboardPage.tsx";

import MentorContentPage
    from "../features/mentor/content/pages/MentorContentPage.tsx";

import MentorProfile
    from "../features/mentor/profile/pages/MentorProfile.tsx";

import MentorTopicContributionsPage
    from "../features/mentor/topic-contribution/pages/MentorTopicContributionsPage.tsx";

import MentorTopicContributionDetailsPage
    from "../features/mentor/topic-contribution/pages/MentorTopicContributionDetailsPage.tsx";

import MentorPendingPage
    from "../features/mentor/pending/pages/MentorPendingPage.tsx";

// ==================== QUESTION MANAGEMENT ====================

import QuestionTypePickerPage
    from "../features/mentor/questions/pages/QuestionTypePickerPage.tsx";

import McqQuestionListPage
    from "../features/mentor/questions/pages/mcq/McqQuestionListPage.tsx";

import McqQuestionDetailsPage
    from "../features/mentor/questions/pages/mcq/McqQuestionDetailsPage.tsx";

import McqQuestionFormPage
    from "../features/mentor/questions/pages/mcq/McqQuestionFormPage.tsx";

import CodingQuestionListPage
    from "../features/mentor/questions/pages/coding/CodingQuestionListPage.tsx";

import CodingQuestionDetailsPage
    from "../features/mentor/questions/pages/coding/CodingQuestionDetailsPage.tsx";

import CodingQuestionFormPage
    from "../features/mentor/questions/pages/coding/CodingQuestionFormPage.tsx";

// ==================== COMMUNITY ====================

import {
    MentorCommunityPage,
    MentorCommunityPostPage,
    MentorSavedPostsPage,
} from "../features/common/community/pages/routeWrappers.tsx";


export default function MentorRoutes() {
    return (
        <Routes>

            {/* ==================== MENTOR PROTECTED AREA ==================== */}

            <Route
                element={
                    <ProtectedRoute allowedRoles={["Mentor"]} />
                }
            >

                {/* Mentor Landing */}
                <Route
                    index
                    element={<MentorLandingPage />}
                />

                <Route element={<MentorLayout />}>

                    {/* ==================== DASHBOARD ==================== */}

                    <Route
                        path="dashboard"
                        element={<MentorDashboardPage />}
                    />


                    {/* ==================== CONTENT ==================== */}

                    <Route
                        path="content"
                        element={<MentorContentPage />}
                    />


                    {/* ==================== PENDING WORK ==================== */}

                    <Route
                        path="pending"
                        element={<MentorPendingPage />}
                    />


                    {/* ==================== PROFILE ==================== */}

                    <Route
                        path="profile"
                        element={<MentorProfile />}
                    />


                    {/* ==================== TOPIC CONTRIBUTIONS ==================== */}

                    <Route
                        path="contributions"
                        element={<MentorTopicContributionsPage />}
                    />

                    <Route
                        path="contributions/:contributionId"
                        element={
                            <MentorTopicContributionDetailsPage />
                        }
                    />


                    {/* ==================== QUESTION MANAGEMENT ==================== */}

                    {/* Question Type Selection */}
                    <Route
                        path="questions"
                        element={<QuestionTypePickerPage />}
                    />


                    {/* ==================== MCQ ==================== */}

                    <Route
                        path="questions/mcq"
                        element={<McqQuestionListPage />}
                    />

                    <Route
                        path="questions/mcq/create"
                        element={<McqQuestionFormPage />}
                    />

                    <Route
                        path="questions/mcq/:id"
                        element={<McqQuestionDetailsPage />}
                    />

                    <Route
                        path="questions/mcq/:id/edit"
                        element={<McqQuestionFormPage />}
                    />


                    {/* ==================== CODING ==================== */}

                    <Route
                        path="questions/coding"
                        element={<CodingQuestionListPage />}
                    />

                    <Route
                        path="questions/coding/create"
                        element={<CodingQuestionFormPage />}
                    />

                    <Route
                        path="questions/coding/:id"
                        element={<CodingQuestionDetailsPage />}
                    />

                    <Route
                        path="questions/coding/:id/edit"
                        element={<CodingQuestionFormPage />}
                    />


                    {/* ==================== COMMUNITY ==================== */}

                    <Route
                        path="community"
                        element={<MentorCommunityPage />}
                    />

                    <Route
                        path="community/post/:postId"
                        element={<MentorCommunityPostPage />}
                    />

                    <Route
                        path="community/saved-posts"
                        element={<MentorSavedPostsPage />}
                    />

                </Route>
            </Route>

        </Routes>
    );
}