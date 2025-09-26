import React, { useState, useEffect, useCallback } from "react";
import { SweetCard, SearchAndFilter } from "../components/index.js"; 
import { mockFetchSweets, mockPurchaseSweet, mockDeleteSweet } from "../utils/index.js";
import { FaPlus } from 'react-icons/fa'; 
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice.js";

function Dashboard(){
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({ query: '', category: '' });
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    // Admin state for modal management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentSweet, setCurrentSweet] = useState(null);


    const fetchSweets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mockFetchSweets(searchParams);9
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
    }, [searchParams, refreshTrigger]);

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

    const handleSearch = ({ query, category }) => {
        setSearchParams({ query, category });
    };

    const handleClearSearch = () => {
        setSearchParams({ query: '', category: '' });
    };

    // ADMIN HANDLERS
    const handleAddClick = () => {
        setModalMode('add');
        setCurrentSweet(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (sweet) => {
        setModalMode('edit');
        setCurrentSweet(sweet);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = async (sweetId) => {
        if (!window.confirm("Are you sure you want to delete this sweet?")) return;
        try {
            await mockDeleteSweet(sweetId);
            alert("Sweet deleted successfully (Mock).");
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            alert(`Deletion Failed: ${err.message}`);
            setError(err.message);
        }
    };
    
    const handleFormSuccess = (updatedSweet) => {
        alert(`${modalMode === 'add' ? 'Added' : 'Updated'} sweet successfully!`);
        setIsModalOpen(false);
        setRefreshTrigger(prev => prev + 1); // Refresh list
    };
    
    const handleFormError = (message) => {
        setError(message);
    };

    useEffect(() => {
        fetchSweets();
    }, [fetchSweets, refreshTrigger]);

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

            <div className="mb-4 flex justify-end">
                {isAdmin && (
                    <button 
                        onClick={handleAddClick}
                        className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add New Sweet</span>
                    </button>
                )}
            </div>

            {/* Replace old placeholder with the new component */}
            <SearchAndFilter 
                onSearch={handleSearch}
                onClear={handleClearSearch}
                loading={loading}
            />
            
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
                            onEdit={handleEditClick}      
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Admin Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add New Sweet' : `Edit ${currentSweet?.name || 'Sweet'}`}
            >
                <SweetForm
                    mode={modalMode}
                    sweet={currentSweet}
                    onSuccess={handleFormSuccess}
                    onError={handleFormError}
                />
            </Modal>
        </div>
    );
}

export default Dashboard;