"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./AdminAppointments.module.css";

// Define the Appointment type
type Appointment = {
    id: number;
    doctor_id: number;
    doctor_name: string;
    username: string;
    slot_id: number;
    mode: string;
    booked_at: string;
    appointment_date: string;
    mode_of_appointment: string;
    status: string;
    slot_time: string;
    doctor_photo?: string;
};

// API Base URL (To avoid repetition)
const API_URL = "http://localhost:3001/api/admin/appointments";

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Fetch Appointments (Memoized for better performance)
    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            handleError("Fetching Appointments", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Centralized Error Handling
    const handleError = (context: string, err: unknown) => {
        console.error(`${context} Error:`, err);
        setError(`Error: ${context} failed. Please try again.`);
    };

    // Generic Function for Approve/Reject/Delete
    const handleAction = async (id: number, action: "accept" | "reject" | "delete") => {
        setActionLoading(id);
        try {
            const url = action === "delete" ? `${API_URL}/${id}` : `${API_URL}/${id}/${action}`;
            const method = action === "delete" ? "DELETE" : "PUT";

            const response = await fetch(url, { method, credentials: "include" });

            if (!response.ok) {
                throw new Error(`Failed to ${action} appointment`);
            }

            fetchAppointments();
        } catch (err) {
            handleError(`Appointment ${action}`, err);
        } finally {
            setActionLoading(null);
        }
    };

    // Format Time Slot
    const formatTimeSlot = (timeSlot: string | undefined): string =>
        timeSlot
            ? new Date(`2000-01-01T${timeSlot}`).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
              })
            : "Not Available";

    // Render loading state
    if (loading) return <div className={styles.loading}>Loading appointments...</div>;

    // Render error state
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Appointment Requests</h2>

            <div className={styles.appointmentList}>
                {appointments.length === 0 ? (
                    <p className={styles.noAppointments}>No appointments available</p>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt.id} className={styles.appointmentCard}>
                            <div className={styles.info}>
                                {appt.doctor_photo && (
                                    <img
                                        src={appt.doctor_photo}
                                        alt={`Dr. ${appt.doctor_name}`}
                                        className={styles.doctorImage}
                                    />
                                )}
                                <p>
                                    <strong>Patient:</strong> {appt.username || "Not Available"}
                                </p>
                                <p>
                                    <strong>Doctor:</strong> {appt.doctor_name || "Not Available"}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {appt.appointment_date
                                        ? new Date(appt.appointment_date).toLocaleDateString()
                                        : "Not Available"}
                                </p>
                                <p>
                                    <strong>Time:</strong> {formatTimeSlot(appt.slot_time)}
                                </p>
                                <p>
                                    Status:{" "}
                                    <span
                                        className={
                                            appt.status === "approved"
                                                ? styles.approved
                                                : appt.status === "rejected"
                                                ? styles.rejected
                                                : styles.pending
                                        }
                                    >
                                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                    </span>
                                </p>
                            </div>

                            <div className={styles.actions}>
                                {appt.status === "pending" && (
                                    <>
                                        <button
                                            className={styles.approveButton}
                                            onClick={() => handleAction(appt.id, "accept")}
                                            disabled={actionLoading === appt.id}
                                        >
                                            {actionLoading === appt.id ? "Approving..." : "Approve"}
                                        </button>
                                        <button
                                            className={styles.rejectButton}
                                            onClick={() => handleAction(appt.id, "reject")}
                                            disabled={actionLoading === appt.id}
                                        >
                                            {actionLoading === appt.id ? "Rejecting..." : "Reject"}
                                        </button>
                                    </>
                                )}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleAction(appt.id, "delete")}
                                    disabled={actionLoading === appt.id}
                                >
                                    {actionLoading === appt.id ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
