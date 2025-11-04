import { useNavigate, useParams } from "react-router-dom";
import { urlState } from "../Context";
import UseFetch from "../hooks/UseFetch";
import { getTheClicksOfSpecificClick } from "../db/Clicks";
import { deleteUrl, getTheUrlsOfSpecificUser } from "../db/Url";
import { useEffect } from "react";

function Link() {
    const { id } = useParams();
    const { user } = urlState();
    const navigate = useNavigate();

    const {
        data: SpecificUrlData,
        error: SpecificUrlError,
        loading: SpecificUrlLoading,
        fetchData: fetchSpecificUrl
    } = UseFetch(getTheUrlsOfSpecificUser);

    const {
        data: SpecificClickData,
        error: SpecificClickError,
        loading: SpecifiClickLoading,
        fetchData: fetchSpecificClicks
    } = UseFetch(getTheClicksOfSpecificClick);

    const { loading, fetchData: fetchDeleteurl } = UseFetch(deleteUrl);

    // Only fetch when both user.id and id exist
    useEffect(() => {
        if (user?.id && id) {
            fetchSpecificUrl({ id, user_id: user.id });
            fetchSpecificClicks(id);
        }
    }, [user?.id, id]);

    // Handle error redirect safely
    useEffect(() => {
        if (SpecificUrlError) {
            navigate("/dashboard");
        }
    }, [SpecificUrlError]);

    if (SpecificUrlLoading || SpecifiClickLoading) return <div className="text-white p-5">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white flex flex-col items-center gap-10">
            {SpecificUrlData ? (
                <>
                    {/* Link Card */}
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl flex flex-col items-center gap-4">
                        <h1 className="text-3xl font-bold">{SpecificUrlData.title}</h1>
                        <img
                            src={SpecificUrlData.qr_code}
                            alt="QR Code"
                            className="h-48 w-48 object-contain"
                        />
                        <a
                            href={`http://localhost:5173/${SpecificUrlData.short_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-500 font-medium hover:underline break-all"
                        >
                            {`http://localhost:5173/${SpecificUrlData.short_url}`}
                        </a>
                    </div>

                    {/* Statistics */}
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                        {SpecificClickData && SpecificClickData.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 px-3">City</th>
                                        <th className="py-2 px-3">Country</th>
                                        <th className="py-2 px-3">Device</th>
                                        <th className="py-2 px-3">Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SpecificClickData.map((click, index) => (
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}
                                        >
                                            <td className="py-2 px-3">{click.city || "Unknown"}</td>
                                            <td className="py-2 px-3">{click.country || "Unknown"}</td>
                                            <td className="py-2 px-3">{click.device || "Unknown"}</td>
                                            <td className="py-2 px-3">1</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No clicks recorded yet.</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-red-500">URL not found</p>
            )}
        </div>
    );
}

export default Link;
