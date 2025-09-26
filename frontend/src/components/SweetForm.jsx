import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaSave } from 'react-icons/fa';
import { mockAddSweet, mockUpdateSweet } from '../utils/index.js';

const CATEGORIES = ['Chocolate', 'Hard Candy', 'Gummy', 'Jelly Beans', 'Lollipops'];

const SweetForm = ({ mode, sweet, onSuccess, onError }) => {
  const isEdit = mode === 'edit';
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEdit ? sweet : { name: '', category: CATEGORIES[0], price: 0.0, quantity: 0 }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    onError(null);
    try {
      const response = isEdit 
        ? await mockUpdateSweet(sweet._id, data)
        : await mockAddSweet(data);

      if (response.success) onSuccess(response.data);
      else onError(response.message || 'Operation failed.');
    } catch (err) {
      onError(err.message || 'Unexpected error occurred.');
    } finally { setLoading(false); }
  };

  if (!CATEGORIES.length) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl p-6 md:p-8 max-w-md mx-auto space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4">
        {isEdit ? 'Update Sweet' : 'Add New Sweet'}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          {...register("category", { required: "Category is required" })}
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
        <input
          type="number"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          {...register("price", { required: "Price is required", min: { value: 0.01, message: "Must be positive" } })}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Quantity in Stock</label>
        <input
          type="number"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          {...register("quantity", { required: "Quantity is required", min: { value: 0, message: "Cannot be negative" } })}
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white font-semibold rounded-lg text-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:text-gray-600 transition-all"
      >
        {loading ? 'Saving...' : isEdit ? <><FaSave /> <span>Update Sweet</span></> : <><FaPlus /> <span>Add Sweet</span></>}
      </button>
    </form>
  );
};

export default SweetForm;
