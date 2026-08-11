import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage.tsx";
import RegisterPage from "../features/auth/RegisterPage.tsx";
import LearnerRoutes from "./LearnerRoutes.tsx";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../features/auth/ResetPasswordPage.tsx";
import ChangePasswordPage from "../features/auth/ChangePasswordPage.tsx";
import MentorSetupPage from "../features/auth/MentorSetupPage.tsx";

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
            </Routes>
        </BrowserRouter>
    );
}