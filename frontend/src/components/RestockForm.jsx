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
        const fetchSweetsForRestock = async () => {
            setFetchLoading(true);
            try {
                const response = await mockFetchSweets(); // Fetch all sweets for dropdown
                if (response.success) {
                    setSweetsList(response.data);
                }
            } catch (error) {
                // Ignore fetch errors for this component's functionality
            } finally {
                setFetchLoading(false);
            }
        };
        fetchSweetsForRestock();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        onError(null); 
        try {
            // Call mockRestockSweet with the selected sweet ID and amount
            const response = await mockRestockSweet(data.sweetId, data.amount);
            
            if (response.success) {
                onSuccess(response.data);
            } else {
                onError(response.message || 'Restock failed.');
            }
        } catch (err) {
            onError(err.message || 'An unexpected error occurred during restock.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-2 bg-dark-primary/70 border border-slate-gray/50 rounded-lg text-white placeholder-slate-gray focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-colors mt-1";
    const errorStyle = "text-red-400 text-sm mt-1";

    if (fetchLoading) {
        return <div className="text-center text-slate-gray">Loading sweet inventory...</div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Sweet Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Select Sweet to Restock</label>
                <select className={inputStyle} {...register("sweetId", { required: "Sweet selection is required" })}>
                    <option value="">-- Select a Sweet --</option>
                    {sweetsList.map(sweet => (
                        <option key={sweet._id} value={sweet._id}>{sweet.name} (Current: {sweet.quantity})</option>
                    ))}
                </select>
                {errors.sweetId && <p className={errorStyle}>{errors.sweetId.message}</p>}
            </div>

            {/* Restock Amount */}
            <div>
                <label className="block text-sm font-medium text-slate-gray">Restock Amount (Units)</label>
                <input type="number" step="1" className={inputStyle} {...register("amount", { 
                    required: "Amount is required", 
                    min: { value: 1, message: "Must restock at least 1 unit" } 
                })} />
                {errors.amount && <p className={errorStyle}>{errors.amount.message}</p>}
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 
                    bg-light-blue text-dark-primary hover:bg-opacity-90 disabled:bg-slate-gray disabled:cursor-not-allowed"
            >
                {loading ? 'Restocking...' : <><FaBoxes /> <span>Execute Restock</span></>}
            </button>
        </form>
    );
};

export default RestockForm;