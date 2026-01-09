import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png';

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "text-white bg-[#282828]" : "text-gray-400 hover:text-white";
    };

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar Content */}
            <div className={`
                bg-black h-full flex-col border-r border-[#282828]
                fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" onClick={onClose}>
                            <img src={logo} alt="VibeBox" className="h-12 w-auto object-contain" />
                        </Link>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <Link to="/" onClick={onClose} className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all font-semibold ${isActive('/')}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <Link to="/search" onClick={onClose} className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all font-semibold ${isActive('/search')}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </Link>

                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-[#282828]">
                    <div className="flex flex-col gap-4">
                        <Link to="/about" onClick={onClose} className="text-gray-400 hover:text-white text-sm">About</Link>
                        <Link to="/terms" onClick={onClose} className="text-gray-400 hover:text-white text-sm">Terms</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
