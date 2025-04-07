"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "../Calender/showCalender";
import style from "./booking.module.css";
import { formatTime } from "@/utils/formatTime";
import { validateSlots } from "@/utils/validateSlots";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3001/api";

export interface Slot {
    id: number;
    doctor_id: number;
    slot_time: string;
    slot_type: "morning" | "evening";
    is_available: boolean;
}

interface AppointmentProps {
    doctorId: number;
}

export default function Appointment({ doctorId }: AppointmentProps) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [appointmentType, setAppointmentType] = useState<"online" | "offline">("online");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const HospitalList = ["MediCare Heart Institute, Okhla Road"];

    const fetchAvailableSlots = useCallback(async () => {
        if (!doctorId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/appointments/available-slots/${doctorId}/${selectedDate}`,
                {
                    headers: { Accept: "application/json" },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch slots");
            }

            const data = await response.json();
            setSlots(validateSlots(data, selectedDate));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Network error. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [doctorId, selectedDate]);

    useEffect(() => {
        fetchAvailableSlots();
    }, [fetchAvailableSlots]);

    const handleBookAppointment = async () => {
        if (!selectedSlotId) {
            toast.error("Please select a time slot");
            return;
        }

        try {
            setLoading(true);
            setSlots((prev) => prev.map((slot) =>
                slot.id === selectedSlotId ? { ...slot, is_available: false } : slot
            ));

            const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ doctorId, slotId: selectedSlotId, appointmentType, appointmentDate: selectedDate }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to book appointment");
            }

            toast.success(data.message || "Appointment booked successfully!");
            setSelectedSlotId(null);

            setTimeout(fetchAvailableSlots, 500);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Network error");
            setSlots((prev) => prev.map((slot) =>
                slot.id === selectedSlotId ? { ...slot, is_available: true } : slot
            ));
        } finally {
            setLoading(false);
        }
    };

    const morningSlots = useMemo(() => slots.filter((s) => s.slot_type === "morning"), [slots]);
    const eveningSlots = useMemo(() => slots.filter((s) => s.slot_type === "evening"), [slots]);

    return (
        <main className={style.main}>
            <div className={style.info}>
                <h1>Book your next doctor's visit in Seconds</h1>
                <p>Medcare helps you find the best healthcare provider by specialty, location, and more.</p>
            </div>

            <div className={style.slotsBackground}>
                <div className={style.slots}>
                    <div className={style.schedule}>
                        <p>Schedule Appointment</p>
                        <button onClick={handleBookAppointment} disabled={loading || !selectedSlotId}>
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>

                    <div className={style.consult}>
                        <button className={appointmentType === "online" ? style.bgGreen : style.White}
                            onClick={() => setAppointmentType("online")}>
                            Book Video Consult
                        </button>
                        <button className={appointmentType === "offline" ? style.bgGreen : style.White}
                            onClick={() => setAppointmentType("offline")}>
                            Book Hospital Visit
                        </button>
                    </div>

                    <select className={style.hospitalList}>
                        {HospitalList.map((hospital, index) => (
                            <option key={index}>{hospital}</option>
                        ))}
                    </select>

                    <Calendar onDateSelect={setSelectedDate} />

                    {error && <div className={style.error}>{error}</div>}

                    {/* Slots Section */}
                    {["morning", "evening"].map((time) => {
                        const isMorning = time === "morning";
                        const slotList = isMorning ? morningSlots : eveningSlots;

                        return (
                            <div className={style.availableSlots} key={time}>
                                <div className={style.sunCountOfSlots}>
                                    <div className={style.sunMorning}>
                                        <div className={isMorning ? style.sun : style.sunset}></div>
                                        <div className={style.morning}>{isMorning ? "Morning" : "Evening"}</div>
                                    </div>
                                    <div className={style.countOfSlots}>
                                        <span>Slots {slotList.filter((s) => s.is_available).length}</span>
                                    </div>
                                </div>
                                <div className={style.horizontalLine}></div>

                                <div className={style.availableSlotsContainer}>
                                    {slotList.length > 0 ? (
                                        slotList.map((slot) => (
                                            <button key={slot.id}
                                                onClick={() => slot.is_available && setSelectedSlotId(slot.id)}
                                                className={`${slot.id === selectedSlotId ? style.bgGreen : style.bgWhite}
                                                            ${!slot.is_available ? style.disabled : ""}`}
                                                disabled={!slot.is_available}>
                                                {formatTime(slot.slot_time)}
                                            </button>
                                        ))
                                    ) : (
                                        <div className={style.noSlots}>
                                            No {isMorning ? "morning" : "evening"} slots available
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
