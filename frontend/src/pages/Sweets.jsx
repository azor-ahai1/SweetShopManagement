import React, { useState, useEffect, useCallback } from "react";
import { SweetCard, SearchAndFilter, Modal, SweetForm, RestockForm } from "../components/index.js"; 
import { FaPlus, FaBoxes } from 'react-icons/fa'; 
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice.js";
import axios from '../axios.js';

function Sweets() {
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);

    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({ query: '', category: '' });
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentSweet, setCurrentSweet] = useState(null);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

    const fetchSweets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let url = '/sweets';
            
            // Add search parameters if they exist
            const queryParams = new URLSearchParams();
            if (searchParams.query) queryParams.append('name', searchParams.query);
            if (searchParams.category) queryParams.append('category', searchParams.category);
            
            if (queryParams.toString()) {
                url = `/sweets/search?${queryParams.toString()}`;
            }

            const response = await axios.get(url);
            if (response.data.success) {
                setSweets(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch sweets.");
            }
        } catch (err) {
            setError(err.message || "Network error while fetching sweets.");
        } finally {
            setLoading(false);
        }
    }, [searchParams, refreshTrigger]);

    useEffect(() => {
        fetchSweets();
    }, [fetchSweets]);

    const handlePurchase = async (sweetId, purchaseData) => {
        try {
            const response = await axios.post(`/sweets/${sweetId}/purchase`, {
                quantity: purchaseData.quantity,
                comment: purchaseData.comment,
                price: purchaseData.price
            });
            
            if (response.data.success) {
                alert("Purchase successful!!");
                setRefreshTrigger(prev => prev + 1);
            } else {
                throw new Error(response.data.message || 'Purchase failed');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Purchase Failed: ${errorMsg}`);
            setError(errorMsg);
            throw err; // Re-throw to let the modal handle the error
        }
    };

    const handleSearch = ({ query, category }) => setSearchParams({ query, category });
    const handleClearSearch = () => setSearchParams({ query: '', category: '' });

    // Admin Handlers
    const handleAddClick = () => { setModalMode('add'); setCurrentSweet(null); setIsModalOpen(true); };
    const handleEditClick = (sweet) => { setModalMode('edit'); setCurrentSweet(sweet); setIsModalOpen(true); };
    const handleDeleteClick = async (sweetId) => {
        if (!window.confirm("Are you sure you want to delete this sweet?")) return;
        try {
            await axios.delete(`/sweets/${sweetId}`);
            alert("Sweet deleted successfully.");
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Deletion Failed: ${errorMsg}`);
            setError(errorMsg);
        }
    };
    const handleFormSuccess = (updatedSweet) => { 
        alert(`${modalMode==='add'?'Added':'Updated'} sweet successfully!`); 
        setIsModalOpen(false); 
        setRefreshTrigger(prev => prev + 1); 
    };
    const handleFormError = (message) => setError(message);
    const handleRestockClick = () => setIsRestockModalOpen(true);
    const handleRestockSuccess = (updatedSweet) => { 
        alert(`Restock successful! New quantity: ${updatedSweet.stock}`); 
        setIsRestockModalOpen(false); 
        setRefreshTrigger(prev => prev + 1); 
    };

    return (
        <div className="pt-24 min-h-[80vh] container mx-auto px-4 sm:px-6 lg:px-8 pb-12 bg-gray-50">
            
            {/* Header */}
            <header className="text-center py-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">Sweet Shop Sweets</h1>
                <p className="text-lg sm:text-xl text-gray-600">Discover our delicious collection of sweets and treats</p>
            </header>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="mb-6 flex flex-wrap justify-end gap-4">
                    <button onClick={handleRestockClick} className="bg-yellow-400 text-gray-900 p-3 rounded-lg font-semibold hover:bg-yellow-500 flex items-center space-x-2 transition-all">
                        <FaBoxes /> <span>Restock Inventory</span>
                    </button>
                    <button onClick={handleAddClick} className="bg-green-400 text-white p-3 rounded-lg font-semibold hover:bg-green-500 flex items-center space-x-2 transition-all">
                        <FaPlus /> <span>Add New Sweet</span>
                    </button>
                </div>
            )}

            {/* Search & Filter */}
            <SearchAndFilter onSearch={handleSearch} onClear={handleClearSearch} loading={loading} />

            {/* Error Message */}
            {error && (
                <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6">{error}</p>
            )}

            {/* Sweets Grid */}
            {loading ? (
                <div className="text-center text-gray-700 text-xl py-12">Loading products...</div>
            ) : sweets.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-12">
                    No products found. {searchParams.query || searchParams.category ? 'Try adjusting your search criteria.' : 'Check back later!'}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sweets.map(sweet => (
                        <SweetCard 
                            key={sweet._id} 
                            sweet={sweet} 
                            onPurchase={handlePurchase} 
                            isAdmin={isAdmin} 
                            onEdit={handleEditClick} 
                            onDelete={handleDeleteClick} 
                            user={user} 
                        />
                    ))}
                </div>
            )}

            {/* Admin Modals */}
            {isAdmin && (
                <>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Sweet' : `Edit ${currentSweet?.name || 'Sweet'}`}>
                        <SweetForm mode={modalMode} sweet={currentSweet} onSuccess={handleFormSuccess} onError={handleFormError} />
                    </Modal>
                    <Modal isOpen={isRestockModalOpen} onClose={() => setIsRestockModalOpen(false)} title="Restock Sweet Inventory">
                        <RestockForm onSuccess={handleRestockSuccess} onError={handleFormError} />
                    </Modal>
                </>
            )}
        </div>
    );
}

export default Sweets;