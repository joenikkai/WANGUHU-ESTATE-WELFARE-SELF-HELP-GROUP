import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRoutesProps = {
    allowedRoles?: Array<"admin" | "board_member" | "member" | "guest">;
    redirectTo?: string;
};


export const ProtectedRoutes = ({
    allowedRoles,
    redirectTo = '/login',
}: ProtectedRoutesProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user)
        return (
            <Navigate to={redirectTo} replace/>
        );
    
    if (allowedRoles && !allowedRoles.includes(user?.role))
        return (
            <Navigate to="/unauthorized" replace/>
        );
        
    return <Outlet />;
};