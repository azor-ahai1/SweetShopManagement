import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PurchaseCard } from "../components/index.js";
import { mockFetchUserPurchases } from "../utils/index.js";
import { FaUser, FaHistory, FaEnvelope, FaCalendarAlt, FaWallet, FaBoxOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice.js";

function Dashboard(){
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserPurchases = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockFetchUserPurchases(user?.id);
            if (response?.success) setPurchases(response.data || []);
            else setError(response?.message || "Failed to fetch purchase history.");
        } catch (err) {
            setError(err?.message || "Network error while fetching purchase history.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) fetchUserPurchases();
    }, [fetchUserPurchases]);

    const formatDate = (d) => {
        if (!d) return "N/A";
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const stats = useMemo(() => {
        const total = purchases.length;
        const spent = purchases.reduce((s, p) => s + (Number(p.total) || 0), 0);
        const last = purchases.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))[0];
        return { total, spent, lastDate: last?.createdAt };
    }, [purchases]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 pt-20 pb-12">
            <div className="container mx-auto px-4 lg:px-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">My Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">Welcome back, {user?.name || "Sweet Tooth"}!</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Account</p>
                                        <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
                                        <p className="text-sm text-gray-400">{user?.email || "—"}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 border rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="font-medium">{user?.joinDate ? formatDate(user.joinDate) : "N/A"}</p>
                                    </div>
                                    <div className="bg-gray-50 border rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-500">Status</p>
                                        <p className={`font-medium ${isAdmin ? "text-indigo-600" : "text-green-600"}`}>
                                            {isAdmin ? "Administrator" : "Active Customer"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border p-5">
                                <h3 className="text-sm text-gray-500 mb-3">Quick Stats</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                            <FaBoxOpen />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Orders</p>
                                        <p className="font-semibold text-lg">{stats.total}</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                            <FaWallet />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Spent</p>
                                        <p className="font-semibold text-lg">₹{stats.spent.toFixed(2)}</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                            <FaCalendarAlt />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Last</p>
                                        <p className="font-semibold text-lg">{formatDate(stats.lastDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                                        <FaHistory />
                                    </div>
                                    <h2 className="text-xl font-semibold">Purchase History</h2>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {loading ? "Updating…" : `${stats.total} orders`}
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-md bg-red-50 border text-red-700" role="alert" aria-live="polite">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="space-y-3" aria-live="polite">
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-12 bg-gray-100 rounded-md" />
                                        <div className="h-12 bg-gray-100 rounded-md" />
                                        <div className="h-12 bg-gray-100 rounded-md" />
                                    </div>
                                </div>
                            ) : purchases.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-lg font-medium text-gray-700 mb-3">No purchases yet</p>
                                    <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
                                    <button
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm"
                                        onClick={() => window.location.href = "/shop"}
                                    >
                                        Browse products
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {purchases.map(p => (
                                        <PurchaseCard key={p._id} purchase={p} compact />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
