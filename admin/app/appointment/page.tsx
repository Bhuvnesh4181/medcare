"use client";

import { useState } from "react";
import styles from "./AdminAppointments.module.css";

type Appointment = {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Approved";
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "John Doe", doctorName: "Dr. Smith", date: "2025-03-26", time: "10:00 AM", status: "Pending" },
    { id: 2, patientName: "Jane Smith", doctorName: "Dr. Brown", date: "2025-03-27", time: "2:00 PM", status: "Pending" },
  ]);

  const approveAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "Approved" } : appt
      )
    );
  };

  const deleteAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment Requests</h2>
      <div className={styles.appointmentList}>
        {appointments.map((appt) => (
          <div key={appt.id} className={styles.appointmentCard}>
            <div className={styles.info}>
              <p><strong>Patient:</strong> {appt.patientName}</p>
              <p><strong>Doctor:</strong> {appt.doctorName}</p>
              <p><strong>Date & Time:</strong> {appt.date} at {appt.time}</p>
              <p>Status: <span className={appt.status === "Approved" ? styles.approved : styles.pending}>{appt.status}</span></p>
            </div>
            <div className={styles.actions}>
              {appt.status === "Pending" && (
                <button className={styles.approveButton} onClick={() => approveAppointment(appt.id)}>
                  Approve
                </button>
              )}
              <button className={styles.deleteButton} onClick={() => deleteAppointment(appt.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

