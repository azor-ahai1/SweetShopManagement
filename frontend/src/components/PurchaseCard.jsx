import React from 'react';
import { FaCalendarAlt, FaBox, FaDollarSign } from 'react-icons/fa';

function PurchaseCard({ purchase }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  
  const formatPrice = (price) => `₹${(price || 0).toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Purchase Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                Order #{purchase._id?.slice(-8) || 'N/A'}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2" />
                {formatDate(purchase.orderDate || purchase.createdAt)}
              </div>
            </div>
            <span className="mt-2 sm:mt-0 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              Completed
            </span>
          </div>
          {/* Sweet Item */}
          <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
            <div className="flex items-center gap-2">
              <FaBox className="text-green-500" />
              <span className="font-medium text-gray-800">
                {purchase.sweet?.name || 'Sweet Item'}
              </span>
              <span className="text-gray-500">x{purchase.quantity || 1}</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatPrice(purchase.price)}
            </span>
          </div>
          {purchase.comment && (
            <div className="mt-2 text-sm text-gray-600 italic">
              Note: {purchase.comment}
            </div>
          )}
        </div>
        {/* Total Amount */}
        <div className="flex items-center justify-between md:justify-end mt-4 md:mt-0">
          <FaDollarSign className="text-green-500 mr-1" />
          <span className="text-gray-500 text-sm md:text-base">Total:</span>
          <span className="text-green-600 font-bold text-lg md:text-xl ml-2">
            {formatPrice(purchase.price * (purchase.quantity || 1))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PurchaseCard;