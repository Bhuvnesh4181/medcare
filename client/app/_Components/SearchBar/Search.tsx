import Image from "next/image";
import styles from "./Search.module.css";

export default function Search() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span>Find a doctor at your own ease</span>
        </div>

        <div className={styles.searchBar}>
          <span className={styles.icon}>
            <Image src="/search.svg" alt="Search logo" height={20} width={20} />
          </span>
          <input type="text" placeholder="Search doctors" className={styles.input} />
          <button className={styles.button}>Search</button>
        </div>
      </div>
    </>
  );
}
