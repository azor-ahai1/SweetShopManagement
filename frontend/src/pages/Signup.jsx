import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from 'react-icons/fa';
import { mockRegister } from "../utils/index.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";
import axios from '../axios.js'

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post('/users/register', data);
            if (response?.data?.success) {
                const { user, accessToken, refreshToken } = response.data.data;
                dispatch(authLogin({ user, accessToken, refreshToken }));
                navigate('/dashboard');
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Unexpected error during registration.");
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
                    <FaUserPlus /> <span>Sign Up</span>
                </h1>
                <p className="text-center text-gray-500 mb-8">Create your sweet account</p>

                {/* Error Message */}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className={inputStyle}
                            {...register("name", { required: "Name is required" })}
                            disabled={loading}
                        />
                        {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className={inputStyle}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                            })}
                            disabled={loading}
                        />
                        {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={inputStyle}
                            {...register("password", { 
                                required: "Password is required", 
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                            disabled={loading}
                        />
                        {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-500 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Register Account'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-8 text-center text-gray-500">
                    Already have an account? 
                    <Link to="/login" className="text-blue-400 hover:underline ml-2 font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
