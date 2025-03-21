import React, { useState } from "react";
import styles from "./Calender.module.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [offset, setOffset] = useState(0);

  const handlePrev = () => {
    setOffset((prev) => prev - 1);
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleNext = () => {
    setOffset((prev) => prev + 1);
    setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const renderDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i - 3);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <div className={styles.arrowWrapper}>
          <button
            onClick={handlePrev}
            className={`${styles.arrowContainer} ${offset === 0 ? styles.disabled : ""}`}
            disabled={offset === 0}
          >
            <span className={styles.arrow}>&lt;</span>
          </button>
          <span className={styles.monthYear}>
            {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
          </span>
          <button onClick={handleNext} className={styles.arrowContainer}>
            <span className={styles.arrow}>&gt;</span>
          </button>
        </div>
      </div>
      <div className={styles.datesContainer}>
        {renderDates().map((date, index) => (
          <button
            key={index}
            className={`${styles.dateButton} ${
              date.toDateString() === selectedDate.toDateString() ? styles.selectedDate : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            <div className={styles.day}>{date.toLocaleString("default", { weekday: "short" })}</div>
            <div className={styles.date}>{date.getDate()} {date.toLocaleString("default", { month: "short" })}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
