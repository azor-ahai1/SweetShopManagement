import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={onClose} // Allows closing by clicking outside
        >
            <div 
                className="bg-dark-primary/95 p-8 rounded-xl shadow-2xl max-w-lg w-full m-4 border border-light-blue/20 transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()} // Prevent modal closure when clicking inside
            >
                <div className="flex justify-between items-center pb-3 border-b border-slate-gray/30 mb-4">
                    <h2 className="text-2xl font-bold text-light-blue">{title}</h2>
                    <button onClick={onClose} className="text-slate-gray hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;