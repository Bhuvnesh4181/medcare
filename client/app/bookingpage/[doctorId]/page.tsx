"use client";

import { useLogin } from "@/providers/loginProvider";
import Link from "next/link";
import styles from "./bookingpage.module.css";
import Appointment from "../../_Components/appointment/appointmentComp";
import { useParams } from "next/navigation";

export default function Booking() {
    const { user } = useLogin();
    const params = useParams();
    const doctorId = params.doctorId ? Number(params.doctorId) : null;

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Login Required</h1>

                    <p className={styles.message}>
                        You need to be logged in to book appointments with our
                        doctors. Please login to your account to continue with
                        the booking process.
                    </p>

                    <div className={styles.buttonContainer}>
                        <Link href="/login" className={styles.loginButton}>
                            Go to Login
                        </Link>

                        <Link href="/" className={styles.homeButton}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!doctorId) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Invalid Doctor</h1>
                    <p className={styles.message}>
                        The doctor ID is missing or invalid. Please select a
                        valid doctor.
                    </p>
                    <div className={styles.buttonContainer}>
                        <Link href="/doctors" className={styles.homeButton}>
                            Browse Doctors
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <Appointment doctorId={doctorId} />;
}