import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';
import { mockAddSweet, mockUpdateSweet } from '../utils/index.js';

const CATEGORIES = ['Chocolate', 'Hard Candy', 'Gummy', 'Jelly Beans', 'Lollipops'];

const SweetForm = ({ mode, sweet, onSuccess, onError }) => {
    const isEdit = mode === 'edit';
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: isEdit ? sweet : { name: '', category: CATEGORIES[0], price: 0.00, quantity: 0 }
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        onError(null); // Clear previous errors
        try {
            let response;
            if (isEdit) {
                // Call mockUpdateSweet with ID
                response = await mockUpdateSweet(sweet._id, data);
            } else {
                // Call mockAddSweet
                response = await mockAddSweet(data);
            }

            if (response.success) {
                onSuccess(response.data);
            } else {
                onError(response.message || 'Operation failed.');
            }
        } catch (err) {
            onError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-2 bg-dark-primary/70 border border-slate-gray/50 rounded-lg text-white placeholder-slate-gray focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-colors mt-1";
    const errorStyle = "text-red-400 text-sm mt-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Name</label>
                <input type="text" className={inputStyle} {...register("name", { required: "Name is required" })} />
                {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Category</label>
                <select className={inputStyle} {...register("category", { required: "Category is required" })}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className={errorStyle}>{errors.category.message}</p>}
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Price ($)</label>
                <input type="number" step="0.01" className={inputStyle} {...register("price", { 
                    required: "Price is required", 
                    min: { value: 0.01, message: "Must be positive" } 
                })} />
                {errors.price && <p className={errorStyle}>{errors.price.message}</p>}
            </div>

            {/* Quantity */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Quantity in Stock</label>
                <input type="number" step="1" className={inputStyle} {...register("quantity", { 
                    required: "Quantity is required",
                    min: { value: 0, message: "Cannot be negative" }
                })} />
                {errors.quantity && <p className={errorStyle}>{errors.quantity.message}</p>}
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 
                    bg-light-blue text-dark-primary hover:bg-opacity-90 disabled:bg-slate-gray disabled:cursor-not-allowed"
            >
                {loading ? 'Saving...' : (isEdit ? <><FaSave /> <span>Update Sweet</span></> : <><FaPlus /> <span>Add Sweet</span></>)}
            </button>
        </form>
    );
};

export default SweetForm;