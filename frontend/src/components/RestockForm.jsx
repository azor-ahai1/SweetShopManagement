import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaBoxes } from 'react-icons/fa';
import { mockRestockSweet, mockFetchSweets } from '../utils/index.js';

const RestockForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sweetsList, setSweetsList] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchSweets = async () => {
      setFetchLoading(true);
      try {
        const response = await mockFetchSweets();
        if (response.success) setSweetsList(response.data);
      } catch {}
      finally { setFetchLoading(false); }
    };
    fetchSweets();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    onError(null);
    try {
      const response = await mockRestockSweet(data.sweetId, data.amount);
      if (response.success) onSuccess(response.data);
      else onError(response.message || 'Restock failed.');
    } catch (err) {
      onError(err.message || 'Unexpected error during restock.');
    } finally { setLoading(false); }
  };

  if (fetchLoading) {
    return <div className="text-center text-gray-500">Loading sweet inventory...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl p-6 md:p-8 max-w-md mx-auto space-y-6">
      
      <h2 className="text-xl font-bold text-gray-800 text-center">Restock Inventory</h2>

      {/* Sweet Selection */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Select Sweet</label>
        <select 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
          {...register("sweetId", { required: "Sweet selection is required" })}
        >
          <option value="">-- Select a Sweet --</option>
          {sweetsList.map(sweet => (
            <option key={sweet._id} value={sweet._id}>
              {sweet.name} (Current: {sweet.quantity})
            </option>
          ))}
        </select>
        {errors.sweetId && <p className="text-red-500 text-sm mt-1">{errors.sweetId.message}</p>}
      </div>

      {/* Restock Amount */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Restock Amount (Units)</label>
        <input
          type="number"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
          {...register("amount", { 
            required: "Amount is required", 
            min: { value: 1, message: "Must restock at least 1 unit" } 
          })}
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 text-white font-semibold rounded-lg text-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:text-gray-600 transition-all"
      >
        {loading ? 'Restocking...' : <><FaBoxes /> <span>Execute Restock</span></>}
      </button>
    </form>
  );
};

export default RestockForm;
