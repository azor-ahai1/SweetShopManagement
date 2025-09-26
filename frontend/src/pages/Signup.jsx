import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from 'react-icons/fa';
import { mockRegister } from "../utils/index.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";

function Signup(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setError(null);
        setLoading(true);
        try {
            const response = await mockRegister(data);
            
            if (response.success) {
                // Dispatch action to Redux store
                dispatch(authLogin({ user: response.user, accessToken: response.accessToken }));
                navigate('/dashboard'); // Navigate on successful registration/login
            } else {
                // Should not happen with mock, but for safety
                setError("Registration failed. Please try again.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred during registration.");
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
                    <FaUserPlus /> <span>SweetShop Register</span>
                </h1>
                <p className="text-center text-slate-gray mb-8">Create your new sweet account.</p>

                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg text-center mb-4">{error}</p>}

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
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
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
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            disabled={loading}
                        />
                        {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-light-blue text-dark-primary py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all disabled:bg-slate-gray disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Register Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-gray">
                    Already have an account? 
                    <Link to="/login" className="text-light-blue hover:underline ml-2 font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;