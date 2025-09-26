import React, { useState, useEffect } from "react";
import { SweetCard } from "../components/index.js";
import { mockFetchSweets, mockPurchaseSweet } from "../utils/index.js";
import { FaFilter, FaSearch, FaRedo } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice.js";

function Dashboard(){
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    const fetchSweets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockFetchSweets();
            if (response.success) {
                setSweets(response.data);
            } else {
                setError(response.message || "Failed to fetch sweets.");
            }
        } catch (err) {
            setError(err.message || "Network error while fetching sweets.");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (sweetId) => {
        try {
            await mockPurchaseSweet(sweetId);
            alert("Purchase successful! Stock quantity will be updated on next refresh (mock behavior).");
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            alert(`Purchase Failed: ${err.message}`);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [refreshTrigger]); 

    return(
        <div className="pt-24 min-h-[80vh] container mx-auto px-6 pb-12">
            <header className="text-center py-8">
                <h1 className="text-5xl font-extrabold text-light-blue mb-2">
                    Sweet Shop Dashboard
                </h1>
                <p className="text-xl text-slate-gray">
                    Welcome, {user?.name || 'Sweet Tooth'}! Available delights:
                </p>
            </header>

            {/* Controls Section: Search/Filter/Add */}
            <div className="bg-dark-primary/70 p-4 rounded-lg shadow-inner mb-8 flex justify-between items-center border border-light-blue/10">
                <div className="flex space-x-3 items-center">
                    <button className="bg-slate-gray text-white p-2 rounded-md hover:bg-slate-gray/80 flex items-center space-x-2">
                        <FaSearch />
                        <span>Search (TBD)</span>
                    </button>
                    <button className="bg-slate-gray text-white p-2 rounded-md hover:bg-slate-gray/80 flex items-center space-x-2">
                        <FaFilter />
                        <span>Filter (TBD)</span>
                    </button>
                </div>
                <button 
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
                    disabled={loading}
                >
                    <FaRedo className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>
            
            {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-lg text-center mb-4">{error}</p>}

            {loading ? (
                <div className="text-center text-light-blue text-2xl py-12">Loading sweets...</div>
            ) : sweets.length === 0 ? (
                <div className="text-center text-slate-gray text-2xl py-12">No sweets found. Check back later!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sweets.map(sweet => (
                        <SweetCard 
                            key={sweet._id} 
                            sweet={sweet} 
                            onPurchase={handlePurchase}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;