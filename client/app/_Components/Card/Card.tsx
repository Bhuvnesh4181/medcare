import Image from "next/image";
import styles from "./Card.module.css";
import Link from "next/link";
import { Doctor } from "../CardsGrid/ShowCards";

type CardCompProps = Doctor & { handleCardClick: () => void };

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
        <div key={id} className={styles.card} onClick={handleCardClick}>
            <div className={styles.imageContainer}>
                <Image
                    src={profile_pic}
                    alt={name}
                    width={100}
                    height={100}
                    className={styles.profileImage}
                />
            </div>
            <h2 className={styles.name}>
                {name}, {specialty}
            </h2>
            <div className={styles.infoContainer}>
                <Image
                    src={"./Stethoscope.svg"}
                    width={20}
                    height={20}
                    alt="Stethoscope"
                />
                <p className={styles.experience}>{specialty}</p>
                <Image
                    src={"./Hourglass.svg"}
                    width={20}
                    height={20}
                    alt="Hourglass"
                />
                <p className={styles.experience}>{experience} years</p>
            </div>
            <div className={styles.ratingContainer}>
                Rating: {rating}{" "}
                <Image alt="star" width={20} height={20} src={"/star.svg"} />
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