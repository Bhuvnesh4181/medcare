import Image from "next/image";
import styles from "./Card.module.css";
import Link from "next/link";

export default function CardComp(val: any) {
    let e: any = val.doctor;
    return (
        <div key={e.id} className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={e.image}
                    alt={e.name}
                    width={100}
                    height={100}
                    className={styles.profileImage}
                />
            </div>
            <h2 className={styles.name}>
                {e.name}, {e.degree}
            </h2>
            <div className={styles.infoContainer}>
                <Image
                    src={"./Stethoscope.svg"}
                    width={20}
                    height={20}
                    alt="Stethoscope"
                />
                <p className={styles.experience}>{e.specialty}</p>
                <Image
                    src={"./Hourglass.svg"}
                    width={20}
                    height={20}
                    alt="Hourglass"
                />
                <p className={styles.experience}>{e.experience}</p>
            </div>
            <div className={styles.ratingContainer}>
                {Array.from({ length: 5 }, (_, index) => (
                    <Image
                        key={index}
                        src={index < e.rating ? "/star.svg" : "/blankStar.svg"}
                        alt="star"
                        width={20}
                        height={20}
                    />
                ))}
            </div>
            <Link href={"/bookingpage"} className={styles.bookButton}>
                Book Appointment
            </Link>
        </div>
    );
}
