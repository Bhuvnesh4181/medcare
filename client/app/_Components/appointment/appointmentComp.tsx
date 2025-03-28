"use client";

import Calendar from "../Calender/showCalender";
import style from "./booking.module.css";
import { useState, useEffect } from "react";

// API base URL configuration
const API_BASE_URL = "http://localhost:3001/api"; // Updated port to match backend

interface Slot {
    id: number;
    doctor_id: number;
    slot_time: string;
    slot_type: "morning" | "evening";
    is_available: boolean;
}

interface CalendarProps {
    onDateSelect: (date: string) => void;
}

interface AppointmentProps {
    doctorId: number;
}

export default function Appointment({ doctorId }: AppointmentProps) {
    const [offlineGreen, setOfflineGreen] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [appointmentType, setAppointmentType] = useState<
        "online" | "offline"
    >("online");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const HospitalList = ["MediCareHeart Institute, Okhla Road"];

    useEffect(() => {
        if (doctorId) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    // Add this function to check if a slot is in the past
    const isSlotInPast = (slotTime: string, slotDate: string): boolean => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // If the selected date is before today, all slots are in the past
        if (slotDate < today) {
            return true;
        }

        // If it's today, check if the slot time is in the past
        if (slotDate === today) {
            // Parse the slot time
            const [hours, minutes] = slotTime.split(":").map(Number);
            const slotDateTime = new Date();
            slotDateTime.setHours(hours, minutes, 0, 0);

            // If the slot time is earlier than current time, it's in the past
            return slotDateTime < now;
        }

        // Future date, slot is not in the past
        return false;
    };

    // Modify the fetchAvailableSlots function to mark past slots as unavailable
    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            setError(null);

            // Using fetch without credentials for testing
            const response = await fetch(
                `${API_BASE_URL}/appointments/available-slots/${doctorId}/${selectedDate}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch slots");
            }

            const data = await response.json();

            // Ensure all slot data has the required fields and mark past slots as unavailable
            const validatedSlots = data.map((slot: any) => {
                const isPastSlot = isSlotInPast(slot.slot_time, selectedDate);
                return {
                    ...slot,
                    id: slot.id,
                    doctor_id: slot.doctor_id,
                    slot_time: slot.slot_time,
                    slot_type: slot.slot_type || "morning", // Default to morning if missing
                    is_available: isPastSlot
                        ? false
                        : typeof slot.is_available === "boolean"
                        ? slot.is_available
                        : true,
                };
            });

            setSlots(validatedSlots);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load available slots"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedSlotId) {
            setError("Please select a time slot");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include", // This is important for auth cookies
                body: JSON.stringify({
                    doctorId,
                    slotId: selectedSlotId,
                    appointmentType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || "Failed to book appointment"
                );
            }

            // Reset selection and refresh slots
            setSelectedSlotId(null);
            fetchAvailableSlots();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to book appointment"
            );
        } finally {
            setLoading(false);
        }
    };

    // Improved slot filtering with better logging
    const morningSlots = slots.filter((slot) => slot.slot_type === "morning");
    const eveningSlots = slots.filter((slot) => slot.slot_type === "evening");

    function handleToggle(type: "online" | "offline") {
        setAppointmentType(type);
        setOfflineGreen(type === "online");
    }

    function formatTime(timeStr: string): string {
        try {
            // Check if timeStr is already a time string (HH:MM:SS)
            if (timeStr.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
                // It's already in HH:MM format, just format for display
                const [hours, minutes] = timeStr.split(":");
                const hour = parseInt(hours, 10);
                const ampm = hour >= 12 ? "PM" : "AM";
                const hour12 = hour % 12 || 12;
                return `${hour12}:${minutes} ${ampm}`;
            }

            // Otherwise, treat as a full date string
            return new Date(timeStr).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            return timeStr; // Return original if parsing fails
        }
    }

    return (
        <main className={style.main}>
            <div className={style.info}>
                <h1>Book your next doctor's visit in Seconds</h1>
                <p>
                    Medcare helps you find the best healthcare provider by
                    specialty, location, and more, ensuring you get the care you
                    need.
                </p>
            </div>
            <div className={style.slotsBackground}>
                <div className={style.slots}>
                    <div className={style.schedule}>
                        <p>Schedule Appointment</p>
                        <button
                            onClick={handleBookAppointment}
                            disabled={loading || !selectedSlotId}
                        >
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                    <div className={style.consult}>
                        <button
                            className={
                                offlineGreen ? style.bgGreen : style.White
                            }
                            onClick={() => handleToggle("online")}
                        >
                            Book Video Consult
                        </button>
                        <button
                            className={
                                !offlineGreen ? style.bgGreen : style.White
                            }
                            onClick={() => handleToggle("offline")}
                        >
                            Book Hospital Visit
                        </button>
                    </div>
                    <select className={style.hospitalList}>
                        {HospitalList.map((hospital, index) => (
                            <option key={index}>{hospital}</option>
                        ))}
                    </select>
                    <Calendar
                        onDateSelect={(date: string) => setSelectedDate(date)}
                    />
                    {error && <div className={style.error}>{error}</div>}
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sun}></div>
                                <div className={style.morning}>Morning</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span>
                                    Slots{" "}
                                    {
                                        morningSlots.filter(
                                            (s) => s.is_available
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {morningSlots.length > 0 ? (
                                morningSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() =>
                                            slot.is_available &&
                                            setSelectedSlotId(slot.id)
                                        }
                                        className={`${
                                            slot.id === selectedSlotId
                                                ? style.bgGreen
                                                : style.bgWhite
                                        } ${
                                            !slot.is_available
                                                ? style.disabled
                                                : ""
                                        }`}
                                        disabled={!slot.is_available}
                                    >
                                        {formatTime(slot.slot_time)}
                                    </button>
                                ))
                            ) : (
                                <div className={style.noSlots}>
                                    No morning slots available
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sunset}></div>
                                <div className={style.morning}>Evening</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span>
                                    Slots{" "}
                                    {
                                        eveningSlots.filter(
                                            (s) => s.is_available
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {eveningSlots.length > 0 ? (
                                eveningSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() =>
                                            slot.is_available &&
                                            setSelectedSlotId(slot.id)
                                        }
                                        className={`${
                                            slot.id === selectedSlotId
                                                ? style.bgGreen
                                                : style.bgWhite
                                        } ${
                                            !slot.is_available
                                                ? style.disabled
                                                : ""
                                        }`}
                                        disabled={!slot.is_available}
                                    >
                                        {formatTime(slot.slot_time)}
                                    </button>
                                ))
                            ) : (
                                <div className={style.noSlots}>
                                    No evening slots available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}