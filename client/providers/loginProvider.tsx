"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

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

const LoginContext = createContext<UserContextType | undefined>(undefined);

const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/users/me", {
                credentials: "include",
                cache: "no-cache",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                },
            });

            if (res.ok) {
                const userData = await res.json();
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
            const res = await fetch("/api/users/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                setUser(null);
                toast.success("Logged out successfully");
                router.push("/");
            } else {
                throw new Error("Logout failed");
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (isLoading) return null;

    return (
        <LoginContext.Provider value={{ user, setUser, fetchUser, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) throw new Error("useLogin must be used within a LoginProvider");
    return context;
};

export { LoginProvider, useLogin };
