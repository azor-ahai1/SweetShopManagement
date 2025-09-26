import React from 'react';
import { Link } from 'react-router-dom';
import { FaCandyCane } from 'react-icons/fa';

function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl space-y-6">
                
                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex items-center justify-center space-x-3">
                    <FaCandyCane className="text-pink-400 animate-bounce" />
                    <span>Welcome to SweetShop</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-500">
                    Explore our delicious sweets collection, find your favorites, and enjoy a sweet experience.
                </p>

                {/* Call-to-Action Button */}
                <Link 
                    to="/sweets"
                    className="inline-block mt-4 px-6 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition-all"
                >
                    View Sweets
                </Link>
            </div>
        </div>
    );
}

export default Home;