import { useState } from "react"
import api from "@/api/axios"
import { useAuthStore } from "@/store/AuthStore";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountModal() {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const deleteAccount = async () => {
        try {
            setLoading(true);
            await api.delete("/user/delete");
            logout();
            navigate("/");
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <div className="w-auto relative z-10">
            <button onClick={() => setOpen(true)} className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 px-5 py-3 rounded-xl cursor-pointer">Delete Account</button>
            {
                open && (
                    <div className="fixed z-50 inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-xl">
                            <div className="flex justify-center">
                                <div className="w-full max-w-16 h-full max-h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl">!</div>
                            </div>
                            <h2 className="text-center text-2xl font-bold mt-5">
                                Delete Account
                            </h2>
                            <p className="text-center text-gray-500 mt-3">This permanently removes your profile, blogs, likes and images.</p>
                            <div className="mt-8 flex gap-3">
                                <button onClick={() => setOpen(false)} className="flex-1 py-3 rounded-full border cursor-pointer">Cancel</button>
                                <button onClick={deleteAccount} disabled={loading} className="flex-1 py-3 rounded-full bg-red-600 text-white cursor-pointer">
                                    { loading ? "Deleting..." : "Delete" }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}