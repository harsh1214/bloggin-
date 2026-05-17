import api from "@/api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await api.post("/auth/forgot-password", { email });
            setStep(2);
        }
        catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        }
        finally {
            setLoading(false);
        }
    };


    const resetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await api.post("/auth/reset-password", { email, otp, password });
            navigate("/login");
        }
        catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="xl:max-w-screen bg-white shadow sm:rounded-lg flex justify-center">
            <div className="lg:w-1/2 xl:w-5/12 h-full lg:min-h-[90svh] flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-2xl xl:text-4xl font-medium">Forgot Password</h1>
                    <div className="w-full flex-1 mt-8">
                        {
                            error && (
                                <p className="text-red-500 text-center font-semibold mb-5">{error}</p>
                            )
                        }
                        {
                            loading && (
                                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )
                        }
                        <form onSubmit={step === 1 ? sendOtp : resetPassword} className="mx-auto max-w-xs">
                            <div className="relative mt-6">
                                <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm">Email Address</label>
                            </div>
                            {
                                step === 2 && (
                                    <>
                                        <div className="relative mt-8">
                                            <input value={otp} onChange={(e) => { setOtp(e.target.value) }} placeholder="OTP" className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm">Enter OTP</label>
                                        </div>
                                        <div className="relative mt-8">
                                            <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm">New Password</label>
                                        </div>
                                        <div className="relative mt-8">
                                            <input type="password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm" className="peer mt-2 w-full bg-transparent border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm">Confirm Password</label>
                                        </div>
                                    </>
                                )
                            }
                            <div className="flex justify-center mt-10">
                                <button disabled={loading} type="submit" className="btn border border-transparent text-base font-semibold rounded-3xl text-white bg-blue-500 hover:bg-blue-700 py-2 md:text-lg px-8">
                                    {
                                        step === 1 ? ( loading ? "Sending..." : "Send OTP" ) : ( loading ? "Updating..." : "Reset Password" )
                                    }
                                </button>
                            </div>
                            <div className="flex justify-evenly items-center space-x-2 w-80 mt-4">
                                <span className="bg-gray-300 h-px w-full relative top-2"></span>
                                <span className="flex-none uppercase text-md text-gray-900 mt-4 font-semibold">or</span>
                                <span className="bg-gray-300 h-px w-full relative top-2"></span>
                            </div>
                            <Link className="text-center text-blue-500 w-full block mt-6 underline" to="/login">Back to Login</Link>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                <img className="w-full h-full object-cover object-right" src="/login-page.webp" alt="Login Page" />
            </div>

        </div>
    );
}