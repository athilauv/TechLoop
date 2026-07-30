import { Routes, Route } from "react-router-dom";
import LearnerLayout from "../layouts/learner/Pages/LearnerLayout.tsx";
import LandingPage from "../features/landing/pages/LandingPage.tsx";
import ProtectedRoute from "./ProtectedRoute";
import TechnologyPage from "../features/learning/pages/TechnologyPage.tsx";
import TechnologyCategory from "../features/technology-category/pages/TechnologyCategoryPage.tsx";

export default function LearnerRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route element={<LearnerLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="learning" element={<TechnologyCategory />}/>
                    <Route path="learning/:technologySlug" element={<TechnologyPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug" element={<TechnologyPage />}/>
                    <Route path="learning/:technologySlug/:topicSlug/:subTopicSlug" element={<TechnologyPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}