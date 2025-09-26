import React, { useState } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';

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

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 mb-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-gray-700 font-medium mb-1">Search by Name</label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Enter sweet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-all disabled:bg-gray-300 disabled:text-gray-600"
          >
            <FaSearch /> <span>Search</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50"
          >
            <FaRedo /> <span>Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchAndFilter;
