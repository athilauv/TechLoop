import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api.ts";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({
                                           allowedRoles,
                                       }: ProtectedRouteProps) {
    const location = useLocation();

    const {
        data: currentUser,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            </div>
        );
    }

    if (isError || !currentUser) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }}/>
        );
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        switch (currentUser.role) {
            case "Learner":
                return <Navigate to="/learner" replace />;

            case "Mentor":
                return <Navigate to="/mentor" replace />;

            case "Admin":
                return <Navigate to="/admin" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
}