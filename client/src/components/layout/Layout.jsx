import { Outlet } from "react-router-dom"
import Navbar from "../shared/Navbar"
import Footer from "../shared/Footer"

export default function Layout() {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}
