import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LearnerLayout from "../layouts/learner/Pages/LearnerLayout";
import TechnologyCategoryPage from "../features/learner/technology-category/pages/TechnologyCategoryPage.tsx";
import LearningPage from "../features/learner/learning/pages/LearningPage";
import CodingQuestionsPage from "../features/learner/coding-question/pages/CodingQuestionsPage.tsx";
import CodingQuestionPage from "../features/learner/coding-question/pages/CodingQuestionPage.tsx";
import ProfilePage from "../features/learner/profile/pages/ProfilePage.tsx";
import DashboardPage from "../features/learner/dashboard/pages/DashboardPage.tsx";
import AnalyticsPage from "../features/learner/analytics/pages/AnalyticsPage";
import CommunityPage from "../features/learner/community/pages/CommunityPage.tsx";
import CommunityPostPage from "../features/learner/community/pages/CommunityPostPage.tsx";
import SavedPostsPage from "../features/learner/community/pages/SavedPostsPage.tsx";
import LandingPage from "../features/learner/landing/pages/LandingPage.tsx";
import QuestionDiscussionsPage from "../features/learner/coding-question/pages/QuestionDiscussionsPage.tsx";
import CreateTopicContributionPage from "../features/learner/topic-contribution/pages/CreateTopicContributionPage.tsx";
import TopicContributionPage from "../features/learner/topic-contribution/pages/TopicContributionPage.tsx";
import TopicContributionDetailsPage from "../features/learner/topic-contribution/pages/TopicContributionDetailsPage.tsx";

export default function LearnerRoutes() {
    return (
        <Routes>

            {/* Public */}
            <Route index element={<LandingPage />}/>

            {/* Protected Learner Area */}
            <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
                <Route element={<LearnerLayout />}>
                    <Route path="learning" element={<TechnologyCategoryPage />}/>
                    <Route path="learning/:technologySlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug/:subTopicSlug" element={<LearningPage />}/>
                    <Route path="coding-questions" element={<CodingQuestionsPage />}/>
                    <Route path="coding-questions/:questionId" element={<CodingQuestionPage />}/>
                    <Route path="profile" element={<ProfilePage />}/>
                    <Route path="dashboard" element={<DashboardPage />}/>
                    <Route path="analytics" element={<AnalyticsPage />}/>
                    <Route path="community" element={<CommunityPage />}/>
                    <Route path="community/posts/:postId" element={<CommunityPostPage />}/>
                    <Route path="community/saved-posts" element={<SavedPostsPage />}/>
                    <Route path="coding-questions/:questionId/discussions" element={<QuestionDiscussionsPage />}/>
                    <Route path="topic-contributions" element={<TopicContributionPage />}/>
                    <Route path="topic-contributions/create" element={<CreateTopicContributionPage />}/>
                    <Route path="topic-contributions/:contributionId" element={<TopicContributionDetailsPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}