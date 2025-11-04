import { createContext, useContext, useEffect } from "react";
import UseFetch from "./hooks/UseFetch";
import { getCurrentUser, logout } from "./db/Auth"; // 👈 import logout API

export const UrlContext = createContext();

export function UrlProvider({ children }) {
    const { data: user, error, loading, fetchData: fetchuser } = UseFetch(getCurrentUser);

    const isAuthenticated = user?.role === "authenticated";

    useEffect(() => {
        fetchuser();
    }, []);

    const logoutUser = async () => {
        try {
            await logout();
            localStorage.clear();
            sessionStorage.clear();
            await fetchuser();
            console.log("✅ User logged out successfully");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <UrlContext.Provider value={{ user, isAuthenticated, loading, fetchuser, logoutUser }}>
            {children}
        </UrlContext.Provider>
    );
}

export const urlState = () => useContext(UrlContext);
