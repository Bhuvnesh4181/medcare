"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                </ul>
            </div>

            <div className={styles.buttons}>
                <Link href={"/login"} className={styles.loginBtn}>
                    Login
                </Link>
                <Link href={"/register"} className={styles.registerBtn}>
                    Register
                </Link>
            </div>

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
                    <hr className={styles.line}></hr>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/appointments">Appointments</Link>
                        </li>
                        <li>
                            <Link href="/">Health Blog</Link>
                        </li>
                        <li>
                            <Link href="/">Reviews</Link>
                        </li>
                    </ul>
                    <div className={styles.btncon}>
                        <Link href={"/login"} className={styles.loginBtn}>
                            Login
                        </Link>
                        <Link href={"/register"} className={styles.registerBtn}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
