import React, { useState } from 'react';
import { FaSearch, FaFilter, FaRedo } from 'react-icons/fa';


const CATEGORIES = ['All', 'Chocolate', 'Hard Candy', 'Gummy'];

const SearchAndFilter = ({ onSearch, onClear, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onSearch({ 
            query: searchTerm.trim(), 
            category: category === 'All' ? '' : category 
        });
    };
    
    const handleClear = () => {
        setSearchTerm('');
        setCategory('');
        onClear(); 
    };

    const inputStyle = "w-full bg-dark-primary/70 border border-slate-gray/50 rounded-lg text-white placeholder-slate-gray p-2 focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-colors";

    return (
        <div className="bg-dark-primary/70 p-6 rounded-xl shadow-2xl mb-8 border border-light-blue/20">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-slate-gray mb-1">Search by Name</label>
                    <div className="relative">
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by name..."
                            className={inputStyle}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-gray" />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-gray mb-1">Category</label>
                    <select
                        id="category"
                        className={`${inputStyle} appearance-none cursor-pointer`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat === 'All' ? '' : cat} className="bg-dark-primary text-white">
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2 bg-light-blue text-dark-primary rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:bg-slate-gray disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <FaSearch />
                        <span>Search</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={loading}
                        className="py-2 px-4 bg-slate-gray text-white rounded-lg hover:bg-slate-gray/80 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        <FaRedo />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchAndFilter;