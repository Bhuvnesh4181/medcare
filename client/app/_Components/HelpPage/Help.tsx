import React from "react";
import styles from "./Helppage.module.css";

const HelpPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Emergency Contact & Help</h1>
        <p>Quick access to urgent care numbers and emergency contacts.</p>
      </header>
      <section className={styles.contacts}>
        <div className={styles.card}>
          <h2>Emergency Medical Services</h2>
          <p>Dial: <strong>911</strong> (For immediate medical assistance)</p>
        </div>
        <div className={styles.card}>
          <h2>Blood Bank</h2>
          <p>Dial: <strong>1-800-222-1222</strong></p>
        </div>
        <div className={styles.card}>
          <h2>Ambulance</h2>
          <p>Dial: <strong>988</strong> (vehicle support)</p>
        </div>
        <div className={styles.card}>
          <h2>Explore surroundings</h2>
          <p>Find the nearest hospital at <a href="https://www.hospitallocator.com" className={styles.link}>Hospital Locator</a></p>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;