import api from "@/api/axios";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "./DeleteAccountModal";

export default function Profile() {

    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const previewImage = useMemo(() => {
        if (image) {
            return URL.createObjectURL(image);
        }
        if (removeImage) {
            return "/user.svg";
        }
        return (user?.image || "/user.svg");
    }, [image, removeImage, user?.image]);

    useEffect(() => {
        return () => {
            if (previewImage?.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [ previewImage ]);

    const handleUpdate = async () => {

        if (password && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            if (name.trim()) {
                formData.append("name", name);
            }

            if (email.trim()) {
                formData.append("email", email);
            }

            if (password.trim()) {
                formData.append("oldPassword", oldPassword);
                formData.append("password", password);
            }

            if (image) {
                formData.append("profile", image);
            }

            formData.append("removeImage", removeImage);

            const { data } = await api.patch("/user/update", formData);
            setUser(data.data);
            navigate("/dashboard");
        }
        catch (err) {
            setError(err?.response?.data?.error || "Update failed");
        }
        finally {
            setLoading(false);
        }
    }



    return (

        <div className="w-full py-12">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[320px_1fr] md:grid-cols-[240px_1fr] grid-cols-1 gap-6">
                <div className="bg-white/80 backdrop-blur-md p-8 md:shadow">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={previewImage} alt="profile Image" className="w-36 h-36 rounded-full object-cover ring-4 ring-blue-100 md:shadow" />
                            <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:scale-110 transition">
                                + <input hidden type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setRemoveImage(false); setImage(file); }} />
                            </label>
                        </div>
                        <h1 className="mt-6 text-2xl font-bold">{name || "Your Name"}</h1>
                        <p className="text-gray-500 mt-2 text-sm">{email}</p>
                        {
                            !removeImage && (
                                <button onClick={() => { setImage(null); setRemoveImage(true); }} className="mt-6 px-6 py-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer text-sm transition">
                                    Remove Image
                                </button>
                            )
                        }
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="bg-white p-8 md:shadow-sm">
                        <h2 className="font-bold text-xl mb-6">Personal Information</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm text-gray-500">Full Name</label>
                                <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} className="mt-2 w-full p-4 rounded-2xl border border-zinc-200 focus:border-zinc-500 focus:bg-white outline-none transition" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="mt-2 w-full p-4 rounded-2xl focus:bg-white border border-zinc-200 focus:border-zinc-500 outline-none" />
                            </div>
                            <div className="space-y-4 mt-6">
                                <label className="text-sm text-gray-500">Change Password</label>
                                <input type="password" value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} placeholder="Current password" className="mt-2 w-full p-4 rounded-2xl border border-zinc-200 focus:border-zinc-500 outline-none" />
                                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="New password" className="w-full p-4 rounded-2xl border border-zinc-200 focus:border-zinc-500 outline-none" />
                                <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="Confirm new password" className="w-full p-4 rounded-2xl border border-zinc-200 focus:border-zinc-500 outline-none" />
                            </div>
                            {
                                error && (
                                    <div className="p-4 rounded-2xl bg-red-50 text-red-500">{error}</div>
                                )
                            }
                            <button onClick={handleUpdate} disabled={loading} className="w-full p-4 rounded-full hover:cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50">
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                        <div className="mt-10 bg-red-50/50 border border-red-200 rounded-3xl p-6">
                            <h2 className="text-red-600 font-bold">Danger Zone</h2>
                            <p className="mt-2 text-sm text-gray-500 ">
                                Deleting account removes: • Blogs • Likes • Drafts • Images • Profile
                            </p>
                            <div className="mt-5">
                                <DeleteAccountModal />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}