import Image from "next/image";
import styles from "./Footer.module.css"; 

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© EmScripts 2024. All Rights Reserved.</p>
      <div className={styles.icons}>
        <Image
          src="/Phone.png" 
          alt="Phone"
          width={20}
          height={20}
          className={styles.icon}
        />
        <Image
          src="/WhatsApp.png" 
          alt="Whatsapp"
          width={20}
          height={20}
          className={styles.icon}
        />
      </div>
    </footer>
  );
}
