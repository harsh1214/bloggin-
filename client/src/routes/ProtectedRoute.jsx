import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/ui/Loading";
import { useToastStore } from "../store/useToastStore";
import { useEffect } from "react";
import "../styles/Toast.css"

export default function ProtectedRoute() {
    const { isAuth, loading } = useAuthStore();
    const location = useLocation();
    const addToast = useToastStore((s) => s.addToast);

    useEffect(() => {
        if (!loading && !isAuth) {
            const skip = sessionStorage.getItem("skipAuthToast");

            if (skip) {
                sessionStorage.removeItem("skipAuthToast");
            } else {
                addToast({
                    message: "Login to access this page",
                    type: "error"
                });
            }
        }
    }, [isAuth, loading, addToast]);


    if (loading) return <Loading />;

    if (!isAuth) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <Outlet />;
}