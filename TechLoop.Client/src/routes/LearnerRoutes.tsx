import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LearnerLayout from "../layouts/learner/Pages/LearnerLayout";
import TechnologyCategoryPage from "../features/technology-category/pages/TechnologyCategoryPage";
import LearningPage from "../features/learning/pages/LearningPage";
import CodingQuestionsPage from "../features/coding-question/pages/CodingQuestionsPage.tsx";
import CodingQuestionPage from "../features/coding-question/pages/CodingQuestionPage.tsx";
import ProfilePage from "../features/profile/pages/ProfilePage.tsx";
import DashboardPage from "../features/dashboard/pages/DashboardPage.tsx";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import CommunityPage from "../features/community/pages/CommunityPage.tsx";
import CreatePostPage from "../features/community/pages/CreatePostPage.tsx";
import CommunityPostPage from "../features/community/pages/CommunityPostPage.tsx";
import SavedPostsPage from "../features/community/pages/SavedPostsPage.tsx";
import LandingPage from "../features/landing/pages/LandingPage.tsx";

export default function LearnerRoutes() {
    return (
        <Routes>
            <Route index element={<LandingPage />} />
            <Route element={<ProtectedRoute />}>
                    <Route element={<LearnerLayout />}>
                    <Route path="learning" element={<TechnologyCategoryPage />}/>
                    <Route path="learning/:technologySlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug/:subTopicSlug" element={<LearningPage />}/>
                    <Route path="coding-questions" element={<CodingQuestionsPage />}/>
                    <Route path="coding-questions/:questionId" element={<CodingQuestionPage/>}/>
                    <Route path="profile" element={<ProfilePage />}/>
                    <Route path="dashboard" element={<DashboardPage />}/>
                    <Route path="analytics" element={<AnalyticsPage />}/>
                    <Route path="community" element={<CommunityPage />}/>
                    <Route path="community/create-post" element={<CreatePostPage />}/>
                    //<Route path="community/posts/:postId" element={<CommunityPostPage/>}/>
                    <Route path="community/saved-posts" element={<SavedPostsPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}