import React, { useState } from 'react';
import { FaShoppingCart, FaExclamationTriangle, FaEdit, FaTimes } from 'react-icons/fa';

const SweetCard = ({ sweet, onPurchase, isAdmin = false, onEdit, onDelete }) => {
  const { _id, name, description, category, price, stock, image } = sweet;
  const isInStock = stock > 0;
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase(_id);
    } catch (error) {
      // handle error if needed
      console.log(error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col">
      
      {/* Sweet Image */}
      {image && (
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover rounded-md mb-4"
          loading="lazy"
        />
      )}

      {/* Sweet Name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-2"><strong>Category:</strong> {category}</p>

      {/* Description */}
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>

      {/* Price & Stock */}
      <div className="flex justify-between items-center mb-4 border-t border-b border-gray-200 py-3">
        <span className="text-3xl font-extrabold text-gray-900">${price.toFixed(2)}</span>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          isInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {stock} in stock
        </span>
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!isInStock || isPurchasing}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
          isInStock
            ? 'bg-pink-600 text-white hover:bg-pink-700 disabled:bg-pink-300 disabled:text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {isPurchasing ? 'Purchasing...' : (
          isInStock ? (
            <>
              <FaShoppingCart /> <span>Purchase</span>
            </>
          ) : (
            <>
              <FaExclamationTriangle /> <span>Out of Stock</span>
            </>
          )
        )}
      </button>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap justify-end gap-2">
          <button
            onClick={() => onEdit(sweet)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-all"
          >
            <FaEdit /> <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all"
          >
            <FaTimes /> <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SweetCard;
