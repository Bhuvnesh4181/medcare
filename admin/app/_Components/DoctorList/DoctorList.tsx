"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./DoctorList.module.css";

const DEFAULT_DOCTOR_IMAGE = "/default-doctor.png";

interface Doctor {
  doctor_id: number; // Mapped from 'id'
  doctor_name: string; // Mapped from 'name'
  specialty: string; // Mapped from 'specialty'
  experience: number; // Mapped from 'experience'
  rating: number; // Mapped from 'rating'
  location: string;
  doctor_photo: string; // Mapped from 'profile_pic'
}

interface EditFormErrors {
  doctor_name?: string;
  specialty?: string;
  experience?: string;
  location?: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formErrors, setFormErrors] = useState<EditFormErrors>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/doctors/all", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data.data.rows); // Ensure it matches the new backend response
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to load doctors");
      setLoading(false);
    }
  };

  const validateForm = (doctor: Doctor): boolean => {
    const errors: EditFormErrors = {};

    if (!doctor.doctor_name?.trim()) {
      errors.doctor_name = "Doctor name is required";
    }

    if (!doctor.specialty?.trim()) {
      errors.specialty = "Specialty is required";
    }

    if (!doctor.experience || doctor.experience < 0) {
      errors.experience = "Valid experience years required";
    }

    if (!doctor.location?.trim()) {
      errors.location = "Location is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const handleEdit = (doctor: Doctor) => {
  //   setEditingDoctor({ ...doctor });
  //   setFormErrors({});
  //   setUpdateSuccess(false);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingDoctor) return;

    const { name, value } = e.target;
    const updatedValue = name === "experience" ? parseInt(value) || 0 : value;

    setEditingDoctor({
      ...editingDoctor,
      [name]: updatedValue,
    });

    if (formErrors[name as keyof EditFormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const handleSave = async () => {
    if (!editingDoctor) return;

    if (!validateForm(editingDoctor)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/doctors/${editingDoctor.doctor_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editingDoctor),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update doctor");
      }

      const result = await response.json();

      if (result.ok) {
        setUpdateSuccess(true);
        fetchDoctors();
        setTimeout(() => {
          setEditingDoctor(null);
          setUpdateSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating doctor:", err);
      setError("Failed to update doctor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/doctors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError("Failed to delete doctor");
    }
  };

  const getImageUrl = (photoUrl: string | null | undefined): string => {
    if (!photoUrl) return DEFAULT_DOCTOR_IMAGE;
    if (photoUrl.startsWith("http")) return photoUrl;
    if (photoUrl.startsWith("/")) return photoUrl;
    return DEFAULT_DOCTOR_IMAGE;
  };

  if (loading) {
    return <div className={styles.loading}>Loading doctors...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Doctors List</h2>
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.doctorList}>
        {doctors.map((doctor) => (
          <li key={doctor.doctor_id} className={styles.doctorItem}>
            <div className={styles.doctorDetails}>
              <div className={styles.doctorHeader}>
                <h3 className={styles.doctorName}>{doctor.doctor_name}</h3>
                <span className={styles.specialty}>{doctor.specialty}</span>
              </div>
              <div className={styles.doctorInfo}>
                <p className={styles.doctorText}>Experience: {doctor.experience} years</p>
                <p className={styles.doctorText}>Location: {doctor.location}</p>
                <p className={styles.doctorText}>Rating: {doctor.rating}</p>
              </div>
              {doctor.doctor_photo && (
                <div className={styles.imageContainer}>
                  <Image
                    src={getImageUrl(doctor.doctor_photo)}
                    alt={`Dr. ${doctor.doctor_name}`}
                    className={styles.doctorImage}
                    width={120}
                    height={120}
                  />
                </div>
              )}
              <div className={styles.actionButtons}>
               
                <button className={styles.deleteBtn} onClick={() => handleDelete(doctor.doctor_id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
