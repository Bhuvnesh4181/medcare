"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/providers/loginProvider";

export default function GoogleCallback() {
    const router = useRouter();
    const { setUser } = useLogin();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the user data from the backend
                const response = await fetch(
                    "http://localhost:3001/api/users/me",
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to get user data");
                }

                const data = await response.json();
                if (data) {
                    // Set user data and redirect to home
                    setUser(data);
                    router.push("/");
                } else {
                    throw new Error("No user data received");
                }
            } catch (error) {
                console.error("Google callback error:", error);
                router.push("/login");
            }
        };

        handleCallback();
    }, [router, setUser]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundImage: "url('/LoginHero.png')",
                backgroundSize: "cover",
            }}
        >
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    padding: "2rem",
                    borderRadius: "10px",
                    backdropFilter: "blur(16px)",
                    textAlign: "center",
                    color: "#0b4b2f",
                    fontWeight: "500",
                }}
            >
                Completing Google sign-in...
            </div>
        </div>
    );
}