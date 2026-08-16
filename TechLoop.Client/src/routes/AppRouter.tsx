import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/learner/auth/LoginPage.tsx";
import RegisterPage from "../features/learner/auth/RegisterPage.tsx";
import LearnerRoutes from "./LearnerRoutes.tsx";
import ForgotPasswordPage from "../features/learner/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../features/learner/auth/ResetPasswordPage.tsx";
import ChangePasswordPage from "../features/learner/auth/ChangePasswordPage.tsx";
import MentorSetupPage from "../features/learner/auth/MentorSetupPage.tsx";
import MentorRoutes from "./MentorRoutes.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
                <Route path="/reset-password" element={<ResetPasswordPage />}/>
                <Route path="/learner/*" element={<LearnerRoutes />} />
                <Route path="/change-password" element={<ChangePasswordPage />}/>
                <Route path="/mentor/setup" element={<MentorSetupPage />} />
                <Route path="/mentor/*" element={<MentorRoutes />}/>
            </Routes>
        </BrowserRouter>
    );
}