"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";
import { toast } from "sonner";
import styles from "./signup.module.css";

export default function SignUpForm() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Handle input changes dynamically
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        },
        []
    );

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const { name, email, password } = formData;

        if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Registration failed");
            }

            toast.success("Registration successful! Please log in.");
            router.replace("/login"); // Redirect to login page
        } catch (error: any) {
            toast.error(error.message || "An error occurred while registering.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = useCallback(() => {
        setFormData({ name: "", email: "", password: "" });
        toast.info("Form reset");
    }, []);

    const handleGoogleSignIn = useCallback(() => {
        window.location.href = "http://localhost:3001/api/users/google";
    }, []);

    return (
        <div className={styles.signupContainer}>
            <h2>Sign Up</h2>
            <p>
                Already a member? <Link href="/login">Login.</Link>
            </p>

            <form onSubmit={handleRegister}>
                <label>Name</label>
                <div className={styles.inputField}>
                    <div className={styles.inputContainer}>
                        <Image src="/name.svg" alt="Name icon" height={20} width={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <label>Email</label>
                <div className={styles.inputField}>
                    <div className={styles.inputContainer}>
                        <Image src="/email.svg" alt="Email icon" height={20} width={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
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
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${styles.button} ${styles.submitButton}`}
                >
                    {isLoading ? "Registering..." : "Submit"}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className={`${styles.button} ${styles.resetButton}`}
                >
                    Reset
                </button>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign up with Google" />
            </form>
        </div>
    );
}
