"use client";

import { useState, useEffect } from "react";
import styles from "./AdminAppointments.module.css";

type Appointment = {
  id: number;
  doctor_id: number;
  doctor_name: string;
  patient_name: string;
  slot_id: number;
  mode: string;
  booked_at: string;
  appointment_date: string;
  mode_of_appointment: string;
  status: string;
  time_slot: string; // Updated to always include time_slot
  doctor_photo?: string; // Add this field
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments(); // Only fetching appointments now
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments...');
      const response = await fetch('http://localhost:3001/api/admin/appointments', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Appointments data:', data);
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Detailed error:', err);
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      setError('Failed to load appointments');
      setLoading(false);
    }
  };

  // Approve Appointment
  const approveAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}/accept`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to approve appointment");
      }

      fetchAppointments(); // Refresh after approval
    } catch (err) {
      console.error("Error approving appointment:", err);
      setError("Failed to approve appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Appointment
  const rejectAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}/reject`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to reject appointment");
      }

      fetchAppointments(); // Refresh after rejection
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      setError("Failed to reject appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:3001/api/admin/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      fetchAppointments(); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Format time slot for display
  const formatTimeSlot = (timeSlot: string | undefined): string => {
    if (!timeSlot) {
      return "Not Available";
    }
    try {
      const time = new Date(`2000-01-01T${timeSlot}`);
      return time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return "Invalid Time";
    }
  };

  // Show loading while data is being fetched
  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  // Show error if fetching failed
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

 // Render the appointments
return (
  <div className={styles.container}>
    <h2 className={styles.title}>Appointment Requests</h2>
    <div className={styles.appointmentList}>
    {appointments.map((appt, index) => (
  <div key={`${appt.id}-${index}`} className={styles.appointmentCard}>

          <div className={styles.info}>
            {appt.doctor_photo && (
              <img
                src={appt.doctor_photo}
                alt={`Dr. ${appt.doctor_name}`}
                className={styles.doctorImage}
              />
            )}
            <p>
              <strong>Patient:</strong> {appt.patient_name || "Not Available"}
            </p>
            <p>
              <strong>Doctor:</strong> {appt.doctor_name || "Not Available"}
            </p>
            <p>
              <strong>Date:</strong> {appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString() : "Not Available"}
            </p>
            <p>
              <strong>Time:</strong> {formatTimeSlot(appt.time_slot)||" Not Available"}
            </p>
            <p>
              <strong>Mode:</strong> {appt.mode || "Not Available"}
            </p>
            <p>
              <strong>Booked At:</strong> {appt.booked_at ? new Date(appt.booked_at).toLocaleString() : "Not Available"}
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
                  onClick={() => approveAppointment(appt.id)}
                  disabled={actionLoading === appt.id}
                >
                  {actionLoading === appt.id ? "Approving..." : "Approve"}
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => rejectAppointment(appt.id)}
                  disabled={actionLoading === appt.id}
                >
                  {actionLoading === appt.id ? "Rejecting..." : "Reject"}
                </button>
              </>
            )}
            <button
              className={styles.deleteButton}
              onClick={() => deleteAppointment(appt.id)}
              disabled={actionLoading === appt.id}
            >
              {actionLoading === appt.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}