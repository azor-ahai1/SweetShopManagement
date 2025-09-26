import React, { useState } from 'react';
import { FaShoppingCart, FaCheck, FaExclamationTriangle } from 'react-icons/fa';


const SweetCard = ({ sweet, onPurchase, isAdmin = false, onEdit, onDelete }) => {
    const { _id, name, category, price, quantity } = sweet;
    const isInStock = quantity > 0;
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        setIsPurchasing(true);
        try {
            await onPurchase(_id); 
        } catch (error) {
        } finally {
            setIsPurchasing(false);
        }
    };

    const buttonClasses = isInStock 
        ? "bg-light-blue text-dark-primary hover:bg-opacity-90"
        : "bg-slate-gray text-white cursor-not-allowed";

    return (
        <div className="bg-dark-primary/90 rounded-xl shadow-lg p-6 border border-light-blue/10 transform hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-2xl font-bold text-light-blue mb-2">{name}</h3>
            <p className="text-sm text-slate-gray mb-4">Category: {category}</p>
            
            <div className="flex justify-between items-center mb-4 border-t border-b border-slate-gray/30 py-3">
                <span className="text-3xl font-extrabold text-white">${price.toFixed(2)}</span>
                <span className={`text-sm font-semibold p-1 rounded-full px-3 ${isInStock ? 'bg-green-600/50 text-green-300' : 'bg-red-600/50 text-red-300'}`}>
                    {quantity} in stock
                </span>
            </div>

            <button
                onClick={handlePurchase}
                disabled={!isInStock || isPurchasing}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${buttonClasses}`}
            >
                {isPurchasing ? (
                    'Purchasing...'
                ) : isInStock ? (
                    <>
                        <FaShoppingCart />
                        <span>Purchase</span>
                    </>
                ) : (
                    <>
                        <FaExclamationTriangle />
                        <span>Out of Stock</span>
                    </>
                )}
            </button>
            
            {/* Admin Controls */}
            {isAdmin && (
                <div className="mt-4 pt-4 border-t border-slate-gray/30 flex justify-end space-x-2">
                    <button 
                        onClick={() => onEdit(sweet)} 
                        className="py-2 px-3 text-sm text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                    >
                        <FaEdit /> <span>Edit</span>
                    </button>
                    <button 
                        onClick={() => onDelete(sweet._id)} 
                        className="py-2 px-3 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                    >
                        <FaTimes /> <span>Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SweetCard;