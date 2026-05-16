import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { appRoutes } from './routes/AppRoutes.jsx'
import { useAuthStore } from './store/AuthStore.jsx';
import api from './api/axios.jsx';
import { useBlogStore } from './store/BlogStore.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';

function App() {

    const { fetchMostViewed, fetchRecentBlogs } = useBlogStore();
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            }
            catch {
                logout();
            }
            finally {
                setLoading(false);
            }
        };

        checkAuth();
        fetchMostViewed();
        fetchRecentBlogs();
    }, [fetchMostViewed, fetchRecentBlogs, logout, setLoading, setUser]);

    return (
        <>
            <ToastContainer />
            <RouterProvider router={appRoutes} />
        </>
    )
}

export default App