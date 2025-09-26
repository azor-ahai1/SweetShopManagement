import React, { useState, useEffect, useCallback } from "react";
import { PurchaseCard } from "../components/index.js"; 
import { mockFetchUserPurchases } from "../utils/index.js";
import { FaUser, FaHistory, FaEnvelope, FaCalendarAlt } from 'react-icons/fa'; 
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
            if (response.success) {
                setPurchases(response.data);
            } else {
                setError(response.message || "Failed to fetch purchase history.");
            }
        } catch (err) {
            setError(err.message || "Network error while fetching purchase history.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            fetchUserPurchases();
        }
    }, [fetchUserPurchases]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return(
        <div className="pt-24 min-h-[80vh] container mx-auto px-6 pb-12">
            <header className="text-center py-8">
                <h1 className="text-5xl font-extrabold text-light-blue mb-2">
                    My Dashboard
                </h1>
                <p className="text-xl text-slate-gray">
                    Welcome back, {user?.name || 'Sweet Tooth'}!
                </p>
            </header>

            {/* User Details Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
                <div className="flex items-center mb-4">
                    <FaUser className="text-light-blue text-2xl mr-3" />
                    <h2 className="text-3xl font-bold text-light-blue">User Profile</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaUser className="text-slate-gray mr-3" />
                            <div>
                                <p className="text-sm text-slate-gray">Name</p>
                                <p className="text-lg font-semibold text-white">{user?.name || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <FaEnvelope className="text-slate-gray mr-3" />
                            <div>
                                <p className="text-sm text-slate-gray">Email</p>
                                <p className="text-lg font-semibold text-white">{user?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaCalendarAlt className="text-slate-gray mr-3" />
                            <div>
                                <p className="text-sm text-slate-gray">Member Since</p>
                                <p className="text-lg font-semibold text-white">
                                    {user?.joinDate ? formatDate(user.joinDate) : 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                            <div>
                                <p className="text-sm text-slate-gray">Account Status</p>
                                <p className="text-lg font-semibold text-green-400">
                                    {isAdmin ? 'Administrator' : 'Active Customer'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase History Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                    <FaHistory className="text-light-blue text-2xl mr-3" />
                    <h2 className="text-3xl font-bold text-light-blue">Purchase History</h2>
                </div>
                
                {error && (
                    <p className="bg-red-900/50 text-red-300 p-3 rounded-lg text-center mb-4">
                        {error}
                    </p>
                )}
                
                {loading ? (
                    <div className="text-center text-light-blue text-2xl py-12">
                        Loading purchase history...
                    </div>
                ) : purchases.length === 0 ? (
                    <div className="text-center text-slate-gray text-2xl py-12">
                        No purchases yet. Start shopping to see your history here!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {purchases.map(purchase => (
                            <PurchaseCard 
                                key={purchase._id} 
                                purchase={purchase}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;