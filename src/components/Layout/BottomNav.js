import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? "text-white bg-[#282828] rounded-full px-4 py-1"
            : "text-gray-400 hover:text-white px-4 py-1";
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-[#282828] flex justify-around items-center z-50 md:hidden">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs">Home</span>
            </Link>

            <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs">Search</span>
            </Link>

            <Link to="/about" className={`flex flex-col items-center gap-1 ${isActive('/about')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">About</span>
            </Link>
        </div>
    );
}

export default BottomNav;
