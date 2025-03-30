"use client";

import Link from "next/link";
import styles from "./Hero.module.css";
import { useLogin } from "@/providers/loginProvider";

export default function Hero() {
    const { user } = useLogin();

    return (
        <section className={styles.hero}>
            <div className={styles.textContainer}>
                <h1>Health in Your Hands.</h1>
                <p>
                    Take control of your healthcare with MedCare. Book
                    appointments with ease, explore health blogs, and stay on
                    top of your well-being, all in one place.
                </p>
                <Link
                    href={user ? "/appointments" : "/login"}
                    className={styles.ctaButton}
                >
                    Get Started
                </Link>
            </div>

            <div className={styles.heroSection}></div>
        </section>
    );
}