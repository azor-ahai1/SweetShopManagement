import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from 'react-icons/fa';
import { mockLogin } from "../utils/index.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setError(null);
        setLoading(true);
        try {
            const response = await mockLogin(data);
            if (response.success) {
                dispatch(authLogin({ user: response.user, accessToken: response.accessToken }));
                navigate('/dashboard');
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError(err.message || "Unexpected error during login.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors";
    const errorStyle = "text-red-600 text-sm mt-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md sm:max-w-lg bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-200">
                
                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 flex items-center justify-center space-x-3">
                    <FaSignInAlt /> <span>Log In</span>
                </h1>
                <p className="text-center text-gray-500 mb-8">Access your sweet account</p>

                {/* Error */}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className={inputStyle}
                            {...register("email", { required: "Email is required" })}
                            disabled={loading}
                        />
                        {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={inputStyle}
                            {...register("password", { required: "Password is required" })}
                            disabled={loading}
                        />
                        {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-500 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500">
                    Don't have an account? 
                    <Link to="/signup" className="text-blue-400 hover:underline ml-2 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;