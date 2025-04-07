import React, { useState, useEffect } from "react";
import styles from "./Calender.module.css";

interface CalendarProps {
    onDateSelect: (date: string) => void;
}

const Calendar = ({ onDateSelect }: CalendarProps) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());

    // Ensure today is the minimum selectable date
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMinDate(today);

        // Prevent selecting past dates on initial load
        if (selectedDate < today) {
            setSelectedDate(today);
            onDateSelect(today.toISOString().split("T")[0]);
        }
    }, []);

    const updateDate = (daysToAdd: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + daysToAdd);

        if (newDate >= minDate) {
            setSelectedDate(newDate);
            onDateSelect(newDate.toISOString().split("T")[0]);
        }
    };

    const renderDates = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedDate);
            date.setDate(selectedDate.getDate() + i - 3);
            return date;
        });
    };

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.header}>
                <div className={styles.arrowWrapper}>
                    <button
                        onClick={() => updateDate(-1)}
                        className={`${styles.arrowContainer} ${selectedDate <= minDate ? styles.disabled : ""}`}
                        disabled={selectedDate <= minDate}
                    >
                        <span className={styles.arrow}>&lt;</span>
                    </button>
                    <span className={styles.monthYear}>
                        {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
                    </span>
                    <button
                        onClick={() => updateDate(1)}
                        className={styles.arrowContainer}
                    >
                        <span className={styles.arrow}>&gt;</span>
                    </button>
                </div>
            </div>
            <div className={styles.datesContainer}>
                {renderDates().map((date, index) => (
                    <button
                        key={index}
                        className={`${styles.dateButton} 
                            ${date.toDateString() === selectedDate.toDateString() ? styles.selectedDate : ""} 
                            ${date < minDate ? styles.disabledDate : ""}`}
                        onClick={() => updateDate(date.getDate() - selectedDate.getDate())}
                        disabled={date < minDate}
                    >
                        <div className={styles.day}>
                            {date.toLocaleString("default", { weekday: "short" })}
                        </div>
                        <div className={styles.date}>
                            {date.getDate()} {date.toLocaleString("default", { month: "short" })}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
