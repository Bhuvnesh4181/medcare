import React, { useState, useEffect } from "react";
import styles from "./Calender.module.css";

interface CalendarProps {
    onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [offset, setOffset] = useState(0);
    const [minDate, setMinDate] = useState(new Date());

    // Initialize with today's date on component mount
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setMinDate(today);

        // If selected date is in the past, set it to today
        if (selectedDate < today) {
            setSelectedDate(today);
            onDateSelect(today.toISOString().split("T")[0]);
        }
    }, []);

    const handlePrev = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);

        // Don't allow setting date before today
        if (newDate >= minDate) {
            setOffset((prev) => prev - 1);
            setSelectedDate(newDate);
            onDateSelect(newDate.toISOString().split("T")[0]);
        }
    };

    const handleNext = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setOffset((prev) => prev + 1);
        setSelectedDate(newDate);
        onDateSelect(newDate.toISOString().split("T")[0]);
    };

    const handleDateSelect = (date: Date) => {
        // Don't allow selecting dates before today
        if (date >= minDate) {
            setSelectedDate(date);
            onDateSelect(date.toISOString().split("T")[0]);
        }
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
                        className={`${styles.arrowContainer} ${
                            selectedDate <= minDate ? styles.disabled : ""
                        }`}
                        disabled={selectedDate <= minDate}
                    >
                        <span className={styles.arrow}>&lt;</span>
                    </button>
                    <span className={styles.monthYear}>
                        {selectedDate.toLocaleString("default", {
                            month: "long",
                        })}{" "}
                        {selectedDate.getFullYear()}
                    </span>
                    <button
                        onClick={handleNext}
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
                        className={`${styles.dateButton} ${
                            date.toDateString() === selectedDate.toDateString()
                                ? styles.selectedDate
                                : ""
                        } ${date < minDate ? styles.disabledDate : ""}`}
                        onClick={() => handleDateSelect(date)}
                        disabled={date < minDate}
                    >
                        <div className={styles.day}>
                            {date.toLocaleString("default", {
                                weekday: "short",
                            })}
                        </div>
                        <div className={styles.date}>
                            {date.getDate()}{" "}
                            {date.toLocaleString("default", { month: "short" })}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;