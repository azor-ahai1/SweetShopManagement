import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaBoxes } from 'react-icons/fa';
import axios from '../axios.js'; // Assuming axios instance setup for API calls

const RestockForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sweetsList, setSweetsList] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchSweets = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get('/sweets');
        if (response.data.success) {
          setSweetsList(response.data.data);
        } else {
          setFetchError(response.data.message || 'Failed to load sweets.');
        }
      } catch (error) {
        setFetchError(error.message || 'Network error while fetching sweets.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSweets();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    onError(null);
    try {
      // Assuming your API endpoint to restock is /sweets/restock and expects { sweetId, quantity }
      const response = await axios.post(`/sweets/${data.sweetId}/addStock`, {
        quantity: parseInt(data.quantity, 10),
      });

      if (response.data.success) {
        onSuccess(response.data?.stock); // Updated sweet info on success
      } else {
        onError(response.data.message || 'Restock failed.');
      }
    } catch (err) {
      onError(err.message || 'Unexpected error during restock.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center text-gray-500">Loading sweet inventory...</div>;
  }

  if (fetchError) {
    return <div className="text-center text-red-500">{fetchError}</div>;
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
              {sweet.name} (Current: {sweet.stock ?? sweet.stock ?? 0})
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
          {...register("quantity", {
            required: "Amount is required",
            min: { value: 1, message: "Must restock at least 1 unit" }
          })}
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
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
