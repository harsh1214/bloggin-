import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/ui/Loading";

export default function PublicRoute() {
    const isAuth = useAuthStore((s) => s.isAuth);
    const loading = useAuthStore((s) => s.loading);

    if (loading) return <Loading />;

    return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
}