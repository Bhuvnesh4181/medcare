"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface User {
    user_name: string;
    user_emailid: string;
    user_id: number;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const LoginContext = createContext<UserContextType | undefined>(
    undefined
);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch(
                "/api/users/me?_t=" + new Date().getTime(),
                {
                    credentials: "include",
                    cache: "no-cache",
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Pragma: "no-cache",
                    },
                }
            );

            if (res.ok) {
                const userData = await res.json();
                console.log("Fetched user data:", userData);
                setUser(userData);
            } else {
                console.log("Not authenticated, clearing user state");
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/users/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Don't render children until we've checked the user's authentication status
    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <LoginContext.Provider value={{ user, setUser, fetchUser, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context)
        throw new Error("useLogin must be used within a LoginProvider");
    return context;
};