import React from 'react';
import { FaCalendarAlt, FaBox, FaDollarSign } from 'react-icons/fa';

function PurchaseCard({ purchase }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `${price.toFixed(2)}`;
    };

    return (
        <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/30 hover:bg-green-500/20 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Purchase Info */}
                <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                Order #{purchase.orderId || purchase._id?.slice(-8) || 'N/A'}
                            </h3>
                            <div className="flex items-center text-sm text-slate-gray">
                                <FaCalendarAlt className="mr-2" />
                                {formatDate(purchase.purchaseDate || purchase.createdAt)}
                            </div>
                        </div>
                        
                        {/* Always Green Status Badge */}
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            Completed
                        </span>
                    </div>

                    {/* Single Sweet Item */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <FaBox className="text-green-400 mr-2" />
                                <span className="text-white font-medium">
                                    {purchase.sweetName || purchase.name || 'Sweet Item'}
                                </span>
                                <span className="text-slate-gray ml-2">
                                    x{purchase.quantity || 1}
                                </span>
                            </div>
                            <span className="text-green-400 font-semibold">
                                {formatPrice(purchase.totalAmount || purchase.price || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Total Amount */}
                <div className="lg:text-right lg:ml-6">
                    <div className="flex items-center justify-between lg:justify-end">
                        <div className="flex items-center">
                            <FaDollarSign className="text-green-400 mr-2" />
                            <span className="text-sm text-slate-gray">Total:</span>
                            <span className="text-2xl font-bold text-green-400 ml-2">
                                {formatPrice(purchase.totalAmount || purchase.price || 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PurchaseCard;