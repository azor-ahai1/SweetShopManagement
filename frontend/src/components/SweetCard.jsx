import React, { useState } from 'react';
import { FaShoppingCart, FaExclamationTriangle, FaEdit, FaTimes } from 'react-icons/fa';
import PurchaseForm from './PurchaseForm'; // Import the new modal

const SweetCard = ({ sweet, onPurchase, isAdmin = false, onEdit, onDelete, user}) => {
  const { _id, name, description, category, price, stock, image } = sweet;
  const isInStock = stock > 0;
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);

  const handlePurchaseClick = () => {
    setIsPurchaseFormOpen(true);
  };

  const handleConfirmPurchase = async (sweetId, purchaseData) => {
    setIsPurchasing(true);
    try {
      await onPurchase(sweetId, purchaseData);
    } catch (error) {
      console.log(error);
      throw error; // Re-throw to let modal handle the error
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
        
        {/* Sweet Image */}
        {image && (
          <div className="w-full h-40 sm:h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Sweet Name */}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Category */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full font-medium">
              {category}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base mb-4 flex-grow line-clamp-3">
            {description}
          </p>

          {/* Price & Stock */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 p-3 bg-gray-50 rounded-lg gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full text-center ${
              isInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {stock} in stock
            </span>
          </div>

          {/* Purchase Button */}
          {user ? (
            <button
                onClick={handlePurchaseClick}
                disabled={!isInStock || isPurchasing}
                className={`w-full py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all text-sm sm:text-base ${
                isInStock
                    ? 'bg-pink-600 text-white hover:bg-pink-700 disabled:bg-pink-300 disabled:text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
            >
                {isPurchasing ? (
                <span>Processing...</span>
                ) : (
                isInStock ? (
                    <>
                    <FaShoppingCart className="text-sm sm:text-base" /> 
                    <span>Purchase</span>
                    </>
                ) : (
                    <>
                    <FaExclamationTriangle className="text-sm sm:text-base" /> 
                    <span>Out of Stock</span>
                    </>
                )
                )}
            </button>
            ) : (
            <p className="text-center text-gray-500 text-sm mt-2">Log in to purchase</p>
            )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => onEdit(sweet)}
                className="flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-all font-medium"
              >
                <FaEdit /> <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(_id)}
                className="flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all font-medium"
              >
                <FaTimes /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseForm
        isOpen={isPurchaseFormOpen}
        onClose={() => setIsPurchaseFormOpen(false)}
        sweet={sweet}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </>
  );
};

export default SweetCard;