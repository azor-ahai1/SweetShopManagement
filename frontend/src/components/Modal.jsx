import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
    >
        <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 animate-modal mx-2"
        onClick={(e) => e.stopPropagation()}
        >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate pr-4">{title}</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 flex-shrink-0"
                aria-label="Close Modal"
            >
                <FaTimes size={18} />
            </button>
            </div>
        </div>
        <div className="px-4 sm:px-6 py-4 text-gray-700">
            {children}
        </div>
        </div>
        <style jsx>{`
        @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.9) translateY(-20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal {
            animation: modalShow 0.2s ease-out forwards;
        }
        `}</style>
    </div>
    );
};

export default Modal;
