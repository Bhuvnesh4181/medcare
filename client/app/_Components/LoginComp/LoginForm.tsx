"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin } from "@/providers/loginProvider";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";
import { toast } from "sonner";
import styles from "./Login.module.css";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const router = useRouter();
    const { fetchUser } = useLogin();

    // Handle input changes dynamically
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        },
        []
    );

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const { email, password } = credentials;

        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Login failed");
            }

            await fetchUser();
            toast.success("Logged in successfully!");
            router.push("/");
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error.message || "An error occurred while logging in. Please try again.");
        }
    };

    const handleReset = useCallback(() => {
        setCredentials({ email: "", password: "" });
        toast.info("Form reset");
    }, []);

    const handleGoogleSignIn = useCallback(() => {
        window.location.href = "http://localhost:3001/api/users/google";
    }, []);

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <p>
                Are you a new member?{" "}
                <Link href="/register" className={styles.linkButton}>
                    Sign up here.
                </Link>
            </p>

            <form onSubmit={handleLogin}>
                <label>Email</label>
                <div className={styles.inputField}>
                    <div className={styles.inputContainer}>
                        <Image src="/email.svg" alt="Email icon" height={20} width={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <label>Password</label>
                <div className={styles.inputField}>
                    <div className={styles.inputContainer}>
                        <Image src="/lockPass.svg" alt="Password icon" height={20} width={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="********"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
                    Login
                </button>
                <button type="button" onClick={handleReset} className={`${styles.button} ${styles.resetButton}`}>
                    Reset
                </button>

                <p className={styles.forgot}>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </p>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </form>
        </div>
    );
}
