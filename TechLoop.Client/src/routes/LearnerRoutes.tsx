import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LearnerLayout from "../layouts/learner/Pages/LearnerLayout";
import TechnologyCategoryPage from "../features/learner/technology-category/pages/TechnologyCategoryPage.tsx";
import LearningPage from "../features/learner/learning/pages/LearningPage";
import ProfilePage from "../features/learner/profile/pages/ProfilePage.tsx";
import DashboardPage from "../features/learner/dashboard/pages/DashboardPage.tsx";
import AnalyticsPage from "../features/learner/analytics/pages/AnalyticsPage";
import LandingPage from "../features/learner/landing/pages/LandingPage.tsx";
import CodingQuestionsPage from "../features/learner/coding-question/pages/CodingQuestionsPage.tsx";
import CodingQuestionPage from "../features/learner/coding-question/pages/CodingQuestionPage.tsx";
import { LearnerCommunityPage, LearnerCommunityPostPage, LearnerSavedPostsPage } from "../features/common/community/pages/routeWrappers.tsx";
import TopicContributionDetailsPage from "../features/learner/topic-contribition/pages/TopicContributionDetailsPage.tsx";
import CreateTopicContributionPage from "../features/learner/topic-contribition/pages/CreateTopicContributionPage.tsx";
import TopicContributionPage from "../features/learner/topic-contribition/pages/TopicContributionPage.tsx";
import QuestionDiscussionsPage from "../features/learner/coding-question/pages/QuestionDiscussionsPage.tsx";

export default function LearnerRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route index element={<LandingPage />} />

            {/* Protected Learner Area */}
            <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
                <Route element={<LearnerLayout />}>

                    {/* Learning */}
                    <Route path="learning" element={<TechnologyCategoryPage />}/>
                    <Route path="learning/:technologySlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug/:subTopicSlug" element={<LearningPage />}/>
                    {/* Coding Questions */}
                    <Route path="coding-questions" element={<CodingQuestionsPage />}/>
                    <Route path="coding-questions/:questionId" element={<CodingQuestionPage />}/>
                    <Route path="coding-questions/:questionId/discussions" element={<QuestionDiscussionsPage />}/>
                    {/* Profile */}
                    <Route path="profile" element={<ProfilePage />}/>
                    {/* Dashboard */}
                    <Route path="dashboard" element={<DashboardPage />}/>
                    {/* Analytics */}
                    <Route path="analytics" element={<AnalyticsPage />}/>
                    {/* Topic Contributions */}
                    <Route path="topic-contributions" element={<TopicContributionPage />}/>
                    <Route path="topic-contributions/new" element={<CreateTopicContributionPage />}/>
                    <Route path="topic-contributions/:contributionId" element={<TopicContributionDetailsPage />}/>
                    {/* Community */}
                    <Route path="community" element={<LearnerCommunityPage />}/>
                    <Route path="community/posts/:postId" element={<LearnerCommunityPostPage />}/>
                    <Route path="community/saved-posts" element={<LearnerSavedPostsPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}