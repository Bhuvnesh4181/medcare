"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { useLogin } from "@/providers/loginProvider";
import { FaAmbulance } from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, fetchUser } = useLogin();

    // Force re-fetch user data when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.Links}>
                <div className={styles.logo}>
                    <Image
                        src="/Frame.svg"
                        alt="MedLogo"
                        width={45}
                        height={25}
                    />
                    <span>MedCare</span>
                </div>
                <ul className={styles.navLinks}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/appointments">Appointments</Link>
                    </li>
                    <li>
                        <Link href="/healthblog">Health Blog</Link>
                    </li>
                    <li>
                        <Link href="/">Reviews</Link>
                    </li>
                    <li>
                        <Link
                            style={{
                                color: "red",
                                display: "flex",
                                gap: "5px",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            href="/help"
                        >
                            <FaAmbulance />
                            Help
                        </Link>
                    </li>
                </ul>
            </div>

            {user ? (
                <div className={styles.userSection}>
                    <span className={styles.userName}>
                        {user.user_name || "User"}
                    </span>
                    <button onClick={logout} className={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            ) : (
                <div className={styles.buttons}>
                    <Link href={"/login"} className={styles.loginBtn}>
                        Login
                    </Link>
                    <Link href={"/register"} className={styles.registerBtn}>
                        Register
                    </Link>
                </div>
            )}

            {/* Hamburger Icon */}
            <div className={styles.hamburger} onClick={() => setMenuOpen(true)}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`${styles.mobileMenu} ${
                    menuOpen ? styles.open : ""
                }`}
            >
                <div className={styles.mobileMenuContent}>
                    <span
                        className={styles.closeMenu}
                        onClick={() => setMenuOpen(false)}
                    >
                        ×
                    </span>
                    <h2>Welcome to MedCare!</h2>
                    {user && (
                        <p className={styles.mobileUserName}>
                            Hi, {user.user_name}!
                        </p>
                    )}
                    <hr className={styles.line}></hr>
                    <ul>
                        <li>
                            <Link href="/" onClick={() => setMenuOpen(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/appointments"
                                onClick={() => setMenuOpen(false)}
                            >
                                Appointments
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/healthblog"
                                onClick={() => setMenuOpen(false)}
                            >
                                Health Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/" onClick={() => setMenuOpen(false)}>
                                Reviews
                            </Link>
                        </li>
                        <li>
                            <Link
                                style={{
                                    color: "red",
                                    display: "flex",
                                    gap: "5px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                href="/help"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FaAmbulance />
                                Help
                            </Link>
                        </li>
                    </ul>
                    <div className={styles.btncon}>
                        {user ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className={styles.mobileLogoutBtn}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={styles.loginBtn}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className={styles.registerBtn}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}