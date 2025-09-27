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
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all duration-300">
            <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
                    Order #{purchase._id?.slice(-8) || 'N/A'}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                    <FaCalendarAlt className="mr-2 flex-shrink-0" />
                    <span className="truncate">{formatDate(purchase.orderDate || purchase.createdAt)}</span>
                </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex-shrink-0">
                Completed
                </span>
            </div>
            
            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FaBox className="text-green-500 flex-shrink-0" size={14} />
                    <div className="min-w-0 flex-1">
                    <span className="font-medium text-gray-800 text-sm block truncate">
                        {purchase.sweet?.name || 'Sweet Item'}
                    </span>
                    <span className="text-gray-500 text-xs">Qty: {purchase.quantity || 1}</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <span className="font-semibold text-gray-800 text-sm">
                    {formatPrice(purchase.price)}
                    </span>
                    <div className="text-xs text-gray-500">per unit</div>
                </div>
                </div>
                
                {purchase.comment && (
                <div className="text-xs text-gray-600 italic bg-white rounded px-2 py-1 border-l-2 border-blue-200">
                    Note: {purchase.comment}
                </div>
                )}
            </div>
            
            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center text-gray-600 text-sm">
                <FaDollarSign className="text-green-500 mr-1" size={14} />
                <span>Total Amount:</span>
                </div>
                <span className="text-green-600 font-bold text-lg">
                {formatPrice(purchase.price * (purchase.quantity || 1))}
                </span>
            </div>
            </div>
        </div>
    );
}

export default PurchaseCard;