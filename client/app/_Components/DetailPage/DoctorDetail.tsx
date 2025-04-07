import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Doctordetail.module.css";

// Define Doctor type explicitly for modularity
interface Doctor {
    id: string;
    name: string;
    experience: number;
    profile_pic: string;
    rating: number;
    specialty: string;
}

// Reusable component for information display
const InfoItem = ({ icon, alt, text }: { icon: string; alt: string; text: string }) => (
    <div className={styles.infoItem}>
        <Image src={icon} width={24} height={24} alt={alt} />
        <span>{text}</span>
    </div>
);

const DoctorDetails: React.FC<Doctor> = ({ id, name, experience, profile_pic, rating, specialty }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Doctor Profile Image */}
                <div className={styles.imageSection}>
                    <Image src={profile_pic} alt={`${name} Profile Picture`} width={200} height={200} className={styles.profileImage} />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.name}>{name}</h1>
                    <div className={styles.specialtyTag}><span>{specialty}</span></div>

                    {/* Experience & Rating */}
                    <div className={styles.infoRow}>
                        <InfoItem icon="/Hourglass.svg" alt="Experience" text={`${experience} years of experience`} />
                        <InfoItem icon="/star.svg" alt="Rating" text={`Rating: ${rating}/5`} />
                    </div>

                    {/* Doctor's Description */}
                    <div className={styles.description}>
                        <h3>About Dr. {name}</h3>
                        <p>
                            Dr. {name} is a highly skilled {specialty} with {experience} years of expertise.
                            Known for their patient-centric approach, they have a proven track record of providing excellent medical care.
                        </p>
                    </div>

                    {/* Booking Button */}
                    <Link href={`/bookingpage/${id}`} className={styles.bookButton}>
                        Book Appointment
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
