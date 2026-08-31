import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/common/auth/LoginPage.tsx";
import RegisterPage from "../features/common/auth/RegisterPage.tsx";
import LearnerRoutes from "./LearnerRoutes.tsx";
import ForgotPasswordPage from "../features/common/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../features/common/auth/ResetPasswordPage.tsx";
import ChangePasswordPage from "../features/common/auth/ChangePasswordPage.tsx";
import MentorSetupPage from "../features/common/auth/MentorSetupPage.tsx";
import MentorRoutes from "./MentorRoutes.tsx";
import AdminRoutes from "./AdminRoutes.tsx";

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
                <Route path="/admin/*" element={<AdminRoutes />}/>
            </Routes>
        </BrowserRouter>
    );
}