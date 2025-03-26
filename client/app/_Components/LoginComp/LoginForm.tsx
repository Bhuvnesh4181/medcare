"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";
import Image from "next/image";
import { useLogin } from "@/providers/loginProvider";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const { fetchUser } = useLogin();

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response");
            }

            const data = await response.json();
            if (response.ok) {
                await fetchUser();
                router.push("/"); // Redirect to home page after successful login
            } else {
                alert(`Error: ${data.message || "Login failed"}`);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            alert("An error occurred while logging in. Please try again.");
        }
    };

    const handleReset = () => {
        setEmail("");
        setPassword("");
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:3001/api/users/google";
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <p>
                Are you a new member?{" "}
                <Link href="/register" className={styles.linkButton}>
                    Sign up here.
                </Link>
            </p>
            <br />
            <form onSubmit={handleLogin}>
                <label>Email</label>
                <div className={styles.inputField}>
                    <section className={styles.inputcontainer}>
                        <span>
                            <Image
                                src="/email.svg"
                                alt="Email logo"
                                height={20}
                                width={20}
                            />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </section>
                </div>

                <label>Password</label>
                <div className={styles.inputField}>
                    <section className={styles.inputcontainer}>
                        <span>
                            <Image
                                src="/lockPass.svg"
                                alt="pass logo"
                                height={20}
                                width={20}
                            />
                        </span>
                        <input
                            type="password"
                            placeholder="********"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </section>
                </div>

                <button
                    type="submit"
                    className={`${styles.button} ${styles.loginButton}`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className={`${styles.button} ${styles.resetButton}`}
                >
                    Reset
                </button>
                <br />
                <br />
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