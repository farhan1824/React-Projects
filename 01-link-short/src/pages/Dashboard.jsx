import React, { useEffect, useState } from 'react';
import { urlState } from '../Context';
import UseFetch from '../hooks/UseFetch';
import { getUrls } from '../db/Url';
import { getClicks } from '../db/Clicks';
import LinkCard from '../components/LinkCard';
import CreateLink from '../components/CreateLink';

function Dashboard() {
    const [searchedLink, setSearchedLink] = useState("");
    const { user } = urlState();
    const { data: urls, error, loading, fetchData: fetchUrls } = UseFetch(getUrls);
    const { data: clicks, error: clickError, loading: clickLoading, fetchData: fetchClicks } = UseFetch(getClicks);
    // const handleDelete = (id) => {
    //     setUrls(prev => prev.filter(url => url.id !== id)); // remove deleted URL locally
    // };
    useEffect(() => {
        if (user?.id) fetchUrls(user.id);
    }, [user]);

    useEffect(() => {
        if (urls?.length > 0) {
            const urlIds = urls.map(url => url.id);
            fetchClicks(urlIds);
        }
    }, [urls]);

    const filteredUrls = urls?.filter(url =>
        url.title.toLowerCase().includes(searchedLink.toLowerCase())
    );
    const handleDelete = (id) => {
        getUrls(prev => prev.filter(url => url.id !== id));
    };
    return (
        <div className="dashboard min-h-screen bg-gray-900 p-8 text-white">
            <span className='mt-4 flex justify-between gap-3'>
                <h1 className='text-6xl text-left pb-6'>My Links</h1>
                {/* <button

                    className="px-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                >
                    Create Link
                </button> */}
                <CreateLink></CreateLink>
            </span>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition">
                    <h2 className="text-xl font-semibold mb-2">Links Created</h2>
                    <p className="text-3xl font-bold">{urls?.length || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transform transition">
                    <h2 className="text-xl font-semibold mb-2">Total Clicks</h2>
                    <p className="text-3xl font-bold">{clicks?.length || 0}</p>
                </div>
            </div>

            {/* Search Box */}
            <div className="mb-6 relative max-w-md mx-auto">
                <input
                    type="text"
                    value={searchedLink}
                    onChange={(e) => setSearchedLink(e.target.value)}
                    placeholder="Search your links..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400 absolute right-3 top-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Links List */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredUrls || []).map((url) => (
                    <LinkCard key={url.id} url={url} clicks={clicks} fetchUrls={fetchUrls} />
                ))}
                {(!filteredUrls || filteredUrls.length === 0) && (
                    <p className="text-gray-400 col-span-full text-center mt-10">No links found</p>
                )}
            </div>


        </div>
    );
}

export default Dashboard;
