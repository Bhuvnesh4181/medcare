import React from "react";
import { Doctor } from "../CardsGrid/ShowCards";
import Image from "next/image";
import Link from "next/link";
import styles from "./Doctordetail.module.css";

const DoctorDetails = ({
    id,
    name,
    experience,
    profile_pic,
    rating,
    specialty,
}: Doctor) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.imageSection}>
                    <Image
                        src={profile_pic}
                        alt={name}
                        width={200}
                        height={200}
                        className={styles.profileImage}
                    />
                </div>
                <div className={styles.infoSection}>
                    <h1 className={styles.name}>{name}</h1>
                    <div className={styles.specialtyTag}>
                        <span>{specialty}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <div className={styles.infoItem}>
                            <Image
                                src="/Hourglass.svg"
                                width={24}
                                height={24}
                                alt="Experience"
                            />
                            <span>{experience} years of experience</span>
                        </div>
                        <div className={styles.infoItem}>
                            <Image
                                src="/star.svg"
                                width={24}
                                height={24}
                                alt="Rating"
                            />
                            <span>Rating: {rating}/5</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>About Doctor</h3>
                        <p>
                            {name} is an experienced {specialty} specialist with{" "}
                            {experience} years of clinical practice. They are
                            known for their patient-centered approach and
                            exceptional medical care.
                        </p>
                    </div>

                    <Link
                        href={`/bookingpage/${id}`}
                        className={styles.bookButton}
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;