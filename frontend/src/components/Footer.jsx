import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-auto bg-dark-primary border-t border-slate-gray/30">
      <div className="container mx-auto px-6 py-6 text-center text-gray-400">
        <p className="text-sm flex justify-center items-center space-x-2">
          &copy; {new Date().getFullYear()} SweetShop Management. Built with <FaHeart className="text-red-500" /> by Aashish Shukla.
        </p>
      </div>
    </footer>
  );
};

export default Footer;