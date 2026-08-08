import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LearnerLayout from "../layouts/learner/Pages/LearnerLayout";
import TechnologyCategoryPage from "../features/technology-category/pages/TechnologyCategoryPage";
import LearningPage from "../features/learning/pages/LearningPage";

export default function LearnerRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route element={<LearnerLayout />}>
                    <Route path="learning" element={<TechnologyCategoryPage />}/>
                    <Route path="learning/:technologySlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug" element={<LearningPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug/:subTopicSlug" element={<LearningPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}