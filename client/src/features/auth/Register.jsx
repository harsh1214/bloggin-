import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios';
import { useAuthStore } from '../../store/AuthStore';

export default function Register() {

    const setUser = useAuthStore((state) => state.setUser);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...form,
            [name]: value
        };
        setForm(updatedForm);
        if (
            updatedForm.password &&
            updatedForm.confirmPassword &&
            updatedForm.password !== updatedForm.confirmPassword
        ) {
            setError("Password does not match");
        } else {
            setError("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Password does not match");
            setLoading(false);
        }

        else {
            const newForm = { name: form.name, email: form.email, password: form.password };
            try {
                const res = await api.post("/auth/register", newForm);
                setUser(res.data.data.user);
                navigate("/dashboard");
            } catch (error) {
                setError(error.response?.data?.error || "Something went wrong");
            }
            finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="xl:max-w-screen bg-white shadow sm:rounded-lg flex justify-center">
            <div className="lg:w-1/2 xl:w-5/12 h-full lg:min-h-[90svh] flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-2xl xl:text-4xl font-medium">
                        Register to Bloggin
                    </h1>
                    <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
                        {error && <p className="text-red-500 text-center font-semibold mb-2">{error}</p>}
                        <div className="mx-auto max-w-xs">
                            <div className="relative mt-6">
                                <input onChange={handleChange} value={form.name} type="text" name="name" id="name" placeholder="Full Name" className="peer mt-2 w-full bg-transparent border-b-2  border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                <label htmlFor="name" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 bg-transparent transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Full Name</label>
                            </div>
                            <div className="relative mt-6">
                                <input onChange={handleChange} value={form.email} type="email" name="email" id="email" placeholder="Email Address" className="peer mt-2 w-full bg-transparent border-b-2  border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                <label htmlFor="email" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 bg-transparent transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
                            </div>
                            <div className="relative mt-6">
                                <input onChange={handleChange} value={form.password} type="password" name="password" id="password" placeholder="Password" className="peer peer mt-2 w-full bg-transparent border-b-2  border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                <label htmlFor="password" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
                            </div>
                            <div className="relative mt-6">
                                <input onChange={handleChange} value={form.confirmPassword} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" className="peer peer mt-2 w-full bg-transparent border-b-2  border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                                <label htmlFor="confirmPassword" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Confirm Password</label>
                            </div>
                            <div className="flex items-center justify-between mt-8">
                                {loading ? <p>Loading...</p>
                                    :
                                    <>
                                        <button disabled={loading} type="submit" className="btn flex items-center justify-center border border-transparent text-base font-semibold rounded-3xl text-white bg-blue-500 hover:bg-blue-700 hover:cursor-pointer py-2 md:text-lg px-8">Log In</button>
                                        <Link to="/forgot-password" className="font-normal text-blue-500">
                                            Forgot Password?
                                        </Link>
                                    </>
                                }
                            </div>
                            <div className="flex justify-evenly items-center space-x-2 w-80 mt-4">
                                <span className="bg-gray-300 h-px w-full t-2 relative top-2"></span>
                                <span className="flex-none uppercase text-md text-gray-900 mt-4 font-semibold">or</span>
                                <span className="bg-gray-300 h-px w-full t-2 relative top-2"></span>
                            </div>
                            <Link className='text-center text-blue-500 w-full block mt-6 underline' to="/login">Already have an account to Bloggin?</Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                <img className="w-full h-full object-cover object-right" src="/login-page.webp" alt="" />
            </div>
        </div>
    )
}
