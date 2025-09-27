import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

const PurchaseForm = ({ isOpen, onClose, sweet, onConfirmPurchase }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      quantity: 1,
      comment: '',
      price: sweet?.price || 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const watchQuantity = watch('quantity');
  const watchPrice = watch('price');
  
  // Auto-calculate total price when quantity changes
  React.useEffect(() => {
    if (sweet?.price && watchQuantity) {
      setValue('price', sweet.price);
    }
  }, [watchQuantity, sweet?.price, setValue]);
  
  const totalAmount = (watchPrice * watchQuantity) || 0;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onConfirmPurchase(sweet._id, data);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !sweet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto transform transition-all duration-300 animate-modal mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-4">
              Purchase Sweet
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 flex-shrink-0"
              aria-label="Close Modal"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4">
          {/* Sweet Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              {sweet.image && (
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {sweet.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Category: {sweet.category}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${sweet.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {sweet.stock} available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={sweet.stock}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: sweet.stock, message: `Maximum ${sweet.stock} available` }
                })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
              )}
            </div>

            {/* Unit Price */}
            {/* <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                {...register("price", {
                  required: "Price is required",
                  disabled: true,
                  min: { value: 0.01, message: "Price must be positive" }
                })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div> */}

            {/* Comment */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Comment (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add any special instructions or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none"
                {...register("comment")}
              />
            </div>

            {/* Total Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || sweet.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:text-gray-600 transition-all font-medium"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaShoppingCart size={16} />
                    <span>Confirm Purchase</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes modalShow {
          0% { opacity: 0; transform: scale(0.9) translateY(-20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal {
          animation: modalShow 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PurchaseForm;