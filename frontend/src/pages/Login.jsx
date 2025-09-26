import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from 'react-icons/fa';
import { mockLogin } from "../utils/index.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";

function Login(){
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
                // Dispatch action to Redux store
                dispatch(authLogin({ user: response.user, accessToken: response.accessToken }));
                navigate('/dashboard'); 
            } else {
                setError("Login failed. Please check credentials.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 bg-dark-primary/70 border border-slate-gray/50 rounded-lg text-white placeholder-slate-gray focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-colors";
    const errorStyle = "text-red-400 text-sm mt-1";

    return(
        <div className="pt-24 min-h-[80vh] flex items-center justify-center container mx-auto px-6">
            <div className="w-full max-w-lg bg-dark-primary/90 p-8 md:p-12 rounded-xl shadow-2xl border border-light-blue/20">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center text-light-blue mb-2 flex items-center justify-center space-x-3">
                    <FaSignInAlt /> <span>SweetShop Login</span>
                </h1>
                <p className="text-center text-slate-gray mb-8">Sign in to manage your sweets.</p>

                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address (e.g., user@sweet.com or admin@sweet.com)"
                            className={inputStyle}
                            {...register("email", { required: "Email is required" })}
                            disabled={loading}
                        />
                        {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password (e.g., password)"
                            className={inputStyle}
                            {...register("password", { required: "Password is required" })}
                            disabled={loading}
                        />
                        {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-light-blue text-dark-primary py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all disabled:bg-slate-gray disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-gray">
                    Don't have an account? 
                    <Link to="/signup" className="text-light-blue hover:underline ml-2 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;