import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaSave } from 'react-icons/fa';
import { mockAddSweet, mockUpdateSweet } from '../utils/index.js';
import axios from '../axios.js';

const CATEGORIES = [ "Milk Based", "Flour Based", "Syrup Soaked", "Puddings", "Sugar Confectionery", "Chocolate Based", "Bakery Based", "Ice Cream", "Fruit Based", "Others"];

const SweetForm = ({ mode, sweet, onSuccess, onError }) => {
  const isEdit = mode === 'edit';
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm({
    defaultValues: isEdit ? sweet : { name: '', category: CATEGORIES[0], price: 0.0, stock: 0, description: '' }
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const onSubmit = async (data) => {
    if (!isEdit && !image) {
      setError('image', { type: 'manual', message: 'Image is required' });
      return;
    }
    setLoading(true);
    onError(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('image', image);

      const response = isEdit 
        ? await axios.put(`/sweets/${sweet._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        : await axios.post('/sweets/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

      if (response.success) onSuccess(response.data);
      else onError(response.message || 'Operation failed.');
    } catch (err) {
      onError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setError('image', { type: 'manual', message: 'Image is required' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      setImage(null);
      setError('image', { type: 'manual', message: 'Invalid image file' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      setImage(null);
      setError('image', { type: 'manual', message: 'Image too large' });
      return;
    }
    clearErrors('image');
    setImage(file);
  };

  if (!CATEGORIES.length) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-xl p-6 md:p-8 max-w-md mx-auto space-y-5" encType="multipart/form-data">
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
        <label className="block text-gray-700 font-medium mb-2">Price (Rs)</label>
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
          {...register("stock", { required: "Quantity is required", min: { value: 0, message: "Cannot be negative" } })}
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Description</label>
        <textarea
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Image </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-gray-800"
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        {image && !errors.image && (
          <p className="mt-2 text-sm text-gray-600">
            Selected image: {image.name}
          </p>
        )}
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
