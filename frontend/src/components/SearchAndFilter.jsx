import React, { useState } from 'react';
import { FaSearch, FaRedo } from 'react-icons/fa';

const CATEGORIES = [
    "Milk Based", 
    "Flour Based", 
    "Syrup Soaked", 
    "Puddings", 
    "Sugar Confectionery", 
    "Chocolate Based", 
    "Bakery Based", 
    "Ice Cream", 
    "Fruit Based", 
    "Others"
];

const SearchAndFilter = ({ onSearch, onClear, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate price inputs
    const minPriceNum = minPrice ? Number(minPrice) : null;
    const maxPriceNum = maxPrice ? Number(maxPrice) : null;
    
    // Check if min price is greater than max price
    if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }
    
    onSearch({
      query: searchTerm.trim(),
      category: category || '',
      minPrice: minPriceNum,
      maxPrice: maxPriceNum
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onClear();
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* First Row: Search and Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Search by Name
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Enter sweet name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 sm:py-3 pl-4 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-sm sm:text-base"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer transition-all text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Price Range and Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Min Price (₹)
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Max Price (₹)
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="1000"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-all disabled:bg-gray-300 disabled:text-gray-600 text-sm sm:text-base"
          >
            <FaSearch className="text-sm" /> 
            <span>Search</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            <FaRedo className="text-sm" /> 
            <span>Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchAndFilter;