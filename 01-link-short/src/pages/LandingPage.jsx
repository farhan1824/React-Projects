import React, { useState } from 'react';
import cover from "../Images/cover.jpg";
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [ProvidedLink, setProvidedLink] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ProvidedLink) {
            navigate(`/auth?createNew=${ProvidedLink}`);
        }
    };

    return (
        <div className="flex flex-col items-center bg-black min-h-screen px-4">
            {/* Hero Section */}
            <div className="text-center mt-16 max-w-4xl">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
                    The Only URL Shortener You'll Ever Need
                </h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-300">
                    Shorten, manage, and track all your links effortlessly with style and simplicity.
                </p>
            </div>

            {/* Search & Action */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full max-w-xl"
            >
                <input
                    type="text"
                    value={ProvidedLink}
                    onChange={(e) => setProvidedLink(e.target.value)}
                    placeholder="Paste your URL here..."
                    className="w-full sm:flex-1 px-5 py-3 rounded-l-xl sm:rounded-l-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-r-xl sm:rounded-r-xl hover:bg-red-700 transition-shadow shadow-md hover:shadow-lg"
                >
                    Shorten
                </button>
            </form>

            {/* Image Section */}
            <div className="mt-12 w-full flex justify-center">
                <img
                    src={cover}
                    alt="Illustration"
                    className="h-[500px] sm:h-[560px] object-contain rounded-xl shadow-2xl"
                />
            </div>

            {/* Features Section */}
            <div className="mt-16 max-w-5xl text-center grid grid-cols-1 sm:grid-cols-3 gap-10 px-4">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition">
                    <h3 className="text-xl font-semibold text-white mb-2">Fast & Reliable</h3>
                    <p className="text-gray-300">Shorten links instantly with minimal load time and reliable performance.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition">
                    <h3 className="text-xl font-semibold text-white mb-2">Track Analytics</h3>
                    <p className="text-gray-300">Monitor clicks and performance of your URLs in real-time dashboards.</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition">
                    <h3 className="text-xl font-semibold text-white mb-2">Custom URLs</h3>
                    <p className="text-gray-300">Create branded or memorable custom links easily for sharing.</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
