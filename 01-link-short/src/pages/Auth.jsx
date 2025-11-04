import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { UrlContext } from "../Context"; // ✅ import context

export default function Auth() {
    const [search] = useSearchParams();
    const [activeTab, setActiveTab] = useState("Login");
    const longlink = search.get("createNew");

    // ✅ Use context properly
    const { isAuthenticated, loading } = useContext(UrlContext);

    // ✅ Get navigate function once
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate(`/dashboard?${longlink ? `createNew=${longlink}` : ""}`);
        }
    }, [isAuthenticated, loading, longlink, navigate]);

    return (
        <>
            <div className="mt-36 flex flex-col items-center gap-10 text-white">
                <h1 className="text-5xl font-extrabold text-center">
                    {longlink ? "Hold up! Let's login first.." : "Login / Signup"}
                </h1>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6 mx-auto">
                {/* Tabs */}
                <div className="flex border-b border-gray-300">
                    <button
                        className={`flex-1 py-2 text-center font-medium transition-colors ${activeTab === "Login"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-red-600"
                            }`}
                        onClick={() => setActiveTab("Login")}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-medium transition-colors ${activeTab === "Signup"
                                ? "border-b-2 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-red-600"
                            }`}
                        onClick={() => setActiveTab("Signup")}
                    >
                        Signup
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "Login" && <Login />}
                {activeTab === "Signup" && <Signup />}
            </div>
        </>
    );
}
