import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full md:w-1/2 p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full focus:outline-none"
            aria-label="Close Modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="text-gray-700">{children}</div>
      </div>

      <style>
        {`
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-modal {
            animation: modalShow 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
