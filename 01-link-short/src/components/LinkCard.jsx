import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUrl } from '../db/Url';

const LinkCard = ({ url, clicks, fetchUrls }) => {
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Copy short URL to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(`http://localhost:5173/${url.short_url}`);
        alert("Copied to clipboard!");
    };

    // Download QR code image
    const handleDownload = async () => {
        try {
            const response = await fetch(url.qr_code);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${url.title || "qr-code"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    // Delete URL and remove it from UI
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUrl(url.id); // delete from Supabase
            fetchUrls();             // re-fetch all URLs from dashboard
            setShowModal(false);
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700 hover:scale-105 transform transition-all cursor-pointer">
            {/* Link area */}
            <Link to={`/link/${url.id}`} className="block">
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                    <img
                        src={url.qr_code}
                        alt="QR Code"
                        className="w-40 h-40 sm:w-56 sm:h-56 object-contain border border-gray-700 rounded-lg"
                    />
                </div>

                {/* Link Info */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white truncate">{url.title}</h3>
                    <p className="text-gray-300">
                        <span className="font-semibold">Original URL: </span>
                        <span className="break-words">{url.original_url}</span>
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Short URL: </span>
                        <span className="text-red-500">{url.short_url}</span>
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Created At: </span>
                        <span>{new Date(url.created_at).toLocaleString()}</span>
                    </p>
                </div>

                {/* Clicks */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                    <span>Clicks: {clicks?.filter(c => c.url_id === url.id)?.length || 0}</span>
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-around gap-3">
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                    Delete
                </button>
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                >
                    Copy
                </button>
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                    Download
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-white">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">
                            Are you sure you want to delete <span className="font-semibold">{url.title}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkCard;
