"use client";

import { useState } from "react";
import styles from "./DoctorList.module.css";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([
    { 
      id: 1, 
      name: "Dr. John Doe", 
      specialty: "Cardiologist", 
      email: "john@example.com", 
      phone: "123-456-7890", 
      qualification: "MBBS, MD", 
      location: "New York", 
      experience: "10 years"
    },
    { 
      id: 2, 
      name: "Dr. Sarah Lee", 
      specialty: "Neurologist", 
      email: "sarah@example.com", 
      phone: "987-654-3210", 
      qualification: "MBBS, DM", 
      location: "Los Angeles", 
      experience: "8 years"
    }
  ]);

  const [editingDoctor, setEditingDoctor] = useState(null);

  const handleEdit = (doctor) => {
    setEditingDoctor({ ...doctor });
  };

  const handleChange = (e) => {
    setEditingDoctor({ ...editingDoctor, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === editingDoctor.id ? editingDoctor : doctor
      )
    );
    setEditingDoctor(null);
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doctor) => doctor.id !== id));
  };

  return (
    <ul className={styles.doctorList}>
      {doctors.map((doctor) => (
        <li key={doctor.id} className={styles.doctorItem}>
          {editingDoctor && editingDoctor.id === doctor.id ? (
            <div className={styles.editForm}>
              <input className={styles.inputField} type="text" name="name" value={editingDoctor.name} onChange={handleChange} />
              <input className={styles.inputField} type="text" name="specialty" value={editingDoctor.specialty} onChange={handleChange} />
              <input className={styles.inputField} type="email" name="email" value={editingDoctor.email} onChange={handleChange} />
              <input className={styles.inputField} type="text" name="phone" value={editingDoctor.phone} onChange={handleChange} />
              <input className={styles.inputField} type="text" name="qualification" value={editingDoctor.qualification} onChange={handleChange} />
              <input className={styles.inputField} type="text" name="location" value={editingDoctor.location} onChange={handleChange} />
              <input className={styles.inputField} type="text" name="experience" value={editingDoctor.experience} onChange={handleChange} />
              <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            </div>
          ) : (
            <div className={styles.doctorDetails}>
              <p className={styles.doctorText}><strong>{doctor.name}</strong> - {doctor.specialty}</p>
              <p className={styles.doctorText}>Email: {doctor.email} | Phone: {doctor.phone}</p>
              <p className={styles.doctorText}>Qualification: {doctor.qualification} | Location: {doctor.location}</p>
              <p className={styles.doctorText}>Experience: {doctor.experience}</p>
              <button className={styles.editBtn} onClick={() => handleEdit(doctor)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(doctor.id)}>Delete</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}




