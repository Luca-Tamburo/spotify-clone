// Imports
import React from 'react';
import { FaSpotify } from 'react-icons/fa';

const LoadingPage = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-green-500">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white animate-spin">
                <FaSpotify size={48} color="#1db954" />
            </div>
            <h1 className="mt-8 text-white text-xl font-semibold">Loading...</h1>
        </div>
    );
};

export default LoadingPage;
