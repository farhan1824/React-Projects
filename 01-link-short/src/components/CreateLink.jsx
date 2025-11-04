import React, { useEffect, useRef, useState } from "react";
import { urlState } from "../Context";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import QRCode from "qrcode"; // ✅ Use this for PNG generation
import UseFetch from "../hooks/UseFetch";
import { createUrl } from "../db/Url";

const CreateLink = () => {
    const { user } = urlState();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const longlink = searchParams.get("createNew");
    const [showModal, setShowModal] = useState(!!longlink);
    const canvasRef = useRef();
    const [fromvalues, setfromvalues] = useState({
        title: "",
        longurl: longlink || "",
        customurl: "",
    });
    const [error, setError] = useState({});

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longurl: yup.string().url("Must be a valid URL").required("Long URL is required"),
        customurl: yup.string(),
    });

    const handleChange = (e) => {
        setfromvalues({
            ...fromvalues,
            [e.target.id]: e.target.value,
        });
    };

    useEffect(() => {
        if (longlink) setShowModal(true);
    }, [longlink]);

    const closeModal = () => {
        setShowModal(false);
        setfromvalues({ title: "", longurl: "", customurl: "" });
        setTimeout(() => setSearchParams({}), 300);
    };

    const { loading, error: urlError, data, fetchData: fetchUrl } = UseFetch(
        createUrl,
        { ...fromvalues, user_id: user?.id }
    );

    // Generate QR code whenever the longurl changes
    useEffect(() => {
        if (fromvalues.longurl && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, fromvalues.longurl, { width: 250 }, (err) => {
                if (err) console.error("QR code generation error:", err);
            });
        }
    }, [fromvalues.longurl]);

    const CreateNewLink = async (e) => {
        e.preventDefault();
        setError({});
        try {
            await schema.validate(fromvalues, { abortEarly: false });

            // Convert canvas to PNG blob
            let blob = null;
            const canvas = canvasRef.current;
            if (canvas) {
                blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            }

            // Call API with form data + QR code blob
            await fetchUrl(
                {
                    title: fromvalues.title,
                    original_url: fromvalues.longurl,
                    custom_url: fromvalues.customurl,
                    user_id: user.id,
                },
                blob
            );
        } catch (err) {
            console.error(err);
            if (err.inner) {
                const formErrors = {};
                err.inner.forEach((e) => (formErrors[e.path] = e.message));
                setError(formErrors);
            }
        }
    };

    useEffect(() => {
        if (!urlError && data && data.length > 0) {
            navigate(`/link/${data[0].id}`);
        }
    }, [urlError, data, navigate]);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setShowModal(true)}
                className="bg-white text-gray-900 font-semibold p-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-200"
            >
                Create New Link
            </button>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-[600px] border border-gray-700 transform transition-all duration-300 scale-95 opacity-0 animate-[fadeIn_0.3s_ease_forwards]">
                        <h3 className="text-xl font-semibold mb-4 text-left">Create New Link</h3>

                        {/* Canvas for QR code */}
                        {fromvalues.longurl && (
                            <div className="mb-4 flex justify-center">
                                <canvas ref={canvasRef} />
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={CreateNewLink}>
                            <input
                                type="text"
                                value={fromvalues.title}
                                onChange={handleChange}
                                id="title"
                                placeholder="Title"
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

                            <input
                                type="url"
                                value={fromvalues.longurl}
                                onChange={handleChange}
                                id="longurl"
                                placeholder="Original URL"
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {error.longurl && <p className="text-red-500 text-sm">{error.longurl}</p>}

                            <input
                                type="text"
                                value={fromvalues.customurl}
                                onChange={handleChange}
                                id="customurl"
                                placeholder="Custom URL (optional)"
                                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
            </style>
        </>
    );
};

export default CreateLink;
