import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PurchaseCard } from "../components/index.js";
import axios from '../axios.js';
import { FaUser, FaHistory, FaEnvelope, FaCalendarAlt, FaWallet, FaBoxOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice.js";

function Dashboard(){
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                setError("User not authenticated");
                return;
            }

            if (!user.id && !user._id) {
                setLoading(false);
                setError("User ID not found");
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await axios.get('/users/purchase-history', {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response?.data?.success) {
                    const purchaseData = response.data.data.purchases || [];
                    setPurchases(purchaseData);
                } else {
                    const errorMsg = response?.data?.message || "Failed to fetch purchase history.";
                    setError(errorMsg);
                }
            } catch (err) {
                if (err.name === 'AbortError') {
                    setError("Request timed out. Please try again.");
                } else {
                    const errorMessage = err?.response?.data?.message || 
                                       err?.message || 
                                       "Network error while fetching purchase history.";
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, 100);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [user?.id, user?._id]);

    const formatDate = (d) => {
        if (!d) return "N/A";
        try {
            return new Date(d).toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "short", 
                day: "numeric" 
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const stats = useMemo(() => {
        if (!purchases || purchases.length === 0) {
            return { total: 0, spent: 0, lastDate: null };
        }

        const total = purchases.length;
        const spent = purchases.reduce((s, p) => {
            const itemPrice = Number(p.price) || 0;
            const quantity = Number(p.quantity) || 1;
            return s + (itemPrice * quantity);
        }, 0);
        
        const sortedPurchases = [...purchases].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        const lastPurchase = sortedPurchases[0];
        
        const result = { 
            total, 
            spent, 
            lastDate: lastPurchase?.createdAt 
        };
        
        return result;
    }, [purchases]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 pt-16 sm:pt-20 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <header className="mb-6 sm:mb-8">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            My Dashboard
                        </h1>
                        <p className="m-2 text-base sm:text-lg text-gray-600">
                            Welcome back, <span className="font-semibold text-gray-800">{user?.name || "Sweet Tooth"}</span>!
                        </p>
                    </div>
                </header>

                <main className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
                    <aside className="xl:col-span-4">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg">
                                            <FaUser />
                                        </div>
                                        <div className="text-center sm:text-left text-white">
                                            <p className="text-xs sm:text-sm opacity-90">
                                                {isAdmin ? "Admin Account" : "Customer Account"}
                                            </p>
                                            <p className="text-lg sm:text-xl font-bold truncate max-w-[200px]">
                                                {user?.name || "N/A"}
                                            </p>
                                            <p className="text-xs sm:text-sm opacity-90 truncate max-w-[200px]">
                                                {user?.email || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                        <FaBoxOpen className="text-xs" />
                                    </div>
                                    <h3 className="text-md font-semibold text-gray-800">Quick Stats</h3>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                                        <p className="text-sm font-medium text-blue-900">Orders</p>
                                        <p className="text-lg font-bold text-blue-900">{stats.total}</p>
                                    </div>

                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                                        <p className="text-sm font-medium text-emerald-900">Spent</p>
                                        <p className="text-lg font-bold text-emerald-900">₹{stats.spent.toFixed(2)}</p>
                                    </div>

                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                                        <p className="text-sm font-medium text-amber-900">Last Purchase</p>
                                        <p className="text-xs font-bold text-amber-900">{formatDate(stats.lastDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="xl:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                            <FaHistory />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Purchase History</h2>
                                            <p className="text-sm text-gray-600">Track all your sweet purchases</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <span className="text-sm text-gray-600">
                                            {loading ? "Loading..." : error ? "Error" : `${stats.total} orders`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3" role="alert">
                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">!</div>
                                        <div>
                                            <p className="font-medium">Error Loading Purchases</p>
                                            <p className="text-sm mt-1">{error}</p>
                                            <button 
                                                onClick={() => window.location.reload()} 
                                                className="text-sm underline mt-2 hover:text-red-900"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {loading ? (
                                    <div className="space-y-4">
                                        <div className="text-center mb-4">
                                            <p className="text-sm text-gray-500">Loading your purchase history...</p>
                                        </div>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="animate-pulse">
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !error && purchases.length === 0 ? (
                                    <div className="py-12 sm:py-16 text-center">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                                            <FaBoxOpen className="text-3xl text-gray-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-3">No purchases yet</h3>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                            Start exploring our delicious collection of sweets to see your orders here.
                                        </p>
                                        <button
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                                            onClick={() => window.location.href = "/sweets"}
                                        >
                                            <FaBoxOpen />
                                            Browse Sweets
                                        </button>
                                    </div>
                                ) : !error && (
                                    <div className="space-y-4">
                                        {purchases.map((purchase, index) => (
                                            <div key={purchase._id || index} className="transform hover:scale-[1.01] transition-all">
                                                <PurchaseCard purchase={purchase} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
