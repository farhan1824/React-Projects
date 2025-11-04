import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";
import { urlState } from "../Context";

function Header() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    //  Get user and authentication status from context
    const { user, isAuthenticated, fetchuser, logoutUser } = urlState();

    useEffect(() => {
        fetchuser(); // optional — ensures latest user data on mount
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = async () => {
        await logoutUser();
        navigate("/"); // redirect to homepage
    };

    return (
        <header className="bg-white shadow-lg">
            <nav className="flex justify-between items-center px-6 py-3">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
                </Link>

                {/* Right Side */}
                {isAuthenticated ? ( // 👈 Check login status here
                    <div ref={dropdownRef} className="relative inline-block text-left">
                        {/* Avatar */}
                        <img
                            onClick={() => setOpen(!open)}
                            src={user?.user_metadata?.profile_pic || "https://i.pravatar.cc/100"}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover hover:border-blue-500 cursor-pointer transition-all"
                        />

                        {/* Dropdown Menu */}
                        {open && (
                            <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-xl shadow-lg z-50 animate-fadeIn">
                                <div className="px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-700">
                                        {user?.email || "My Account"}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <Link to={"/dashboard"}>
                                        <button
                                            onClick={() => navigate("/dashboard")}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Links
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => navigate("/settings")}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </button>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex justify-between items-center"
                                    >
                                        Log out <span className="text-gray-400">⇧⌘Q</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/auth")}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:text-white transition-all duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                    >
                        Login
                    </button>
                )}
            </nav>
        </header>
    );
}


export default Header;
