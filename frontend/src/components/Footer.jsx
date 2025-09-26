import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-200 shadow-inner">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 text-center md:text-left">
          &copy; {new Date().getFullYear()} SweetShop Management
        </p>
        <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
          Built with <FaHeart className="text-red-500" /> by Aashish Shukla
        </p>
      </div>
    </footer>
  );
};

export default Footer;
