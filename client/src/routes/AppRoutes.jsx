import { createBrowserRouter } from "react-router-dom"
import Layout from "../components/layout/Layout"
import Home from "../pages/Home"
import Blogs from "../pages/Blogs"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"
import ProtectedRoute from "./ProtectedRoute"
import Dashboard from "../features/user/Dashboard"
import PublicRoute from "./PublicRoutes"
import Blog from "../pages/Blog"
import NotFound from "../pages/NotFound"
import CreateBlog from "../features/user/CreateBlog"
import EditBlogPage from "@/features/user/EditBlogPage"
import Profile from "@/features/user/Profile"
// import Loading from "../components/ui/Loading"

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "login",
                        element: <Login />
                    },
                    {
                        path: "register",
                        element: <Register />
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "create-blog",
                        element: <CreateBlog />
                    },
                    {
                        path: "edit/:id",
                        element: <EditBlogPage />
                    },
                    {
                        path: "blogs",
                        element: <Blogs />
                    },
                    {
                        path: "blog/:id",
                        element: <Blog />
                    },
                    {
                        path: "profile",
                        element: <Profile />
                    }
                ]
            },
            {
                path: "*",
                element: <NotFound />
            },
        ]
    }
])