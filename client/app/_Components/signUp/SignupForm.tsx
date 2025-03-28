"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin } from "@/providers/loginProvider";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";
import { toast } from "sonner";

export default function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { fetchUser, setUser } = useLogin();

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
                credentials: "include",
            });

            const data = await response.json();
            if (data.ok) {
                // For direct login after registration, let's also make a login request
                try {
                    const loginResponse = await fetch("/api/users/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                        credentials: "include",
                    });

                    const loginData = await loginResponse.json();

                    if (loginData.ok) {
                        // Set user explicitly from login response
                        setUser(loginData.user);
                        await fetchUser();
                        toast.success("Registration and login successful!");
                        router.replace("/");
                    } else {
                        toast.error(
                            "Registration successful but login failed. Please login manually."
                        );
                        router.replace("/login");
                    }
                } catch (loginError) {
                    toast.error("Registration successful! Please login.");
                    router.replace("/login");
                }
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error("An error occurred while registering.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setPassword("");
        toast.info("Form reset");
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:3001/api/users/google";
    };

    return (
        <div className={styles.signupContainer}>
            <h2>Sign Up</h2>
            <p>
                Already a member? <Link href="/login">Login.</Link>
            </p>

            <form onSubmit={handleRegister}>
                <label>Name</label>
                <div className={styles.inputField}>
                    <section className={styles.inputcontainer}>
                        <span>
                            <Image
                                src="/name.svg"
                                alt="name logo"
                                height={20}
                                width={20}
                            />
                        </span>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </section>
                </div>

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

                <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    text="Sign up with Google"
                />
            </form>
        </div>
    );
}