import Image from "next/image";
import styles from "./Card.module.css";
import Link from "next/link";
import { Doctor } from "../CardsGrid/ShowCards";

type CardCompProps = Doctor & { handleCardClick: () => void };

const InfoItem = ({ src, alt, text }: { src: string; alt: string; text: string }) => (
    <div className={styles.infoItem}>
        <Image src={src} width={20} height={20} alt={alt} />
        <p>{text}</p>
    </div>
);

export default function CardComp({
    experience,
    id,
    name,
    profile_pic,
    rating,
    specialty,
    handleCardClick,
}: CardCompProps) {
    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.imageContainer}>
                <Image
                    src={profile_pic}
                    alt={`${name}'s profile picture`}
                    width={100}
                    height={100}
                    className={styles.profileImage}
                />
            </div>
            <h2 className={styles.name}>{name}, {specialty}</h2>
            <div className={styles.infoContainer}>
                <InfoItem src="/Stethoscope.svg" alt="Specialty" text={specialty} />
                <InfoItem src="/Hourglass.svg" alt="Experience" text={`${experience} years`} />
            </div>
            <div className={styles.ratingContainer}>
                Rating: {rating} <Image alt="star" width={20} height={20} src="/star.svg" />
            </div>
            <Link
                href={`/bookingpage/${id}`}
                onClick={(e) => e.stopPropagation()}
                className={styles.bookButton}
            >
                Book Appointment
            </Link>
        </div>
    );
}