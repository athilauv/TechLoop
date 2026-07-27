import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage.tsx";
import RegisterPage from "../features/auth/RegisterPage.tsx";
import LearnerRoutes from "./LearnerRoutes.tsx";
//import TechnologyPage from "../features/learning/pages/TechnologyPage.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/learner/*" element={<LearnerRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}