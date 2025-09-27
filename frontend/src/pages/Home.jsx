import React from 'react';
import { Link } from 'react-router-dom';
import { FaCandyCane } from 'react-icons/fa';

function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-12 py-12">
            <div className="text-center max-w-4xl space-y-6 sm:space-y-8">
            
            {/* Heading */}
            <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <FaCandyCane className="text-pink-400 animate-bounce text-4xl sm:text-5xl md:text-6xl" />
                <span className="leading-tight">Welcome to SweetShop</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                Explore our delicious sweets collection, find your favorites, and enjoy a sweet experience that will delight your taste buds.
                </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all">
                <div className="text-pink-500 text-2xl sm:text-3xl mb-3">🍬</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Premium Quality</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Handpicked sweets made with finest ingredients</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all">
                <div className="text-pink-500 text-2xl sm:text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Fast Delivery</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Quick and secure delivery to your doorstep</p>
                </div>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all">
                <div className="text-pink-500 text-2xl sm:text-3xl mb-3">💝</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Gift Ready</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Perfect for celebrations and special occasions</p>
                </div>
            </div>
            
            {/* Call-to-Action Button */}
            <div className="pt-4 sm:pt-8">
                <Link
                to="/sweets"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg"
                >
                <span>View Our Sweets Collection</span>
                <FaCandyCane className="animate-pulse" />
                </Link>
            </div>
            </div>
        </div>
    );
}

export default Home;