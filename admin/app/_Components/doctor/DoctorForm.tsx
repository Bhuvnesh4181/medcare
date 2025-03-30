
"use client";
import { useState } from "react";
import styles from "./DoctorForm.module.css";
import { useRouter } from "next/navigation";

export default function DoctorForm({ onDoctorAdded }: { onDoctorAdded: (doctor: any) => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    rating: "",
    location: "",
    gender: "male",
    profile_pic: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!imageFile) {
        throw new Error("Please select an image");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("specialty", formData.specialty);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("rating", formData.rating || "0");
      formDataToSend.append("location", formData.location);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("profile_pic", imageFile);

      const response = await fetch("http://localhost:3001/api/admin/doctors/create", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor");
      }

      setSuccess("Doctor added successfully!");
      setFormData({
        name: "",
        specialty: "",
        experience: "",
        rating: "",
        location: "",
        gender: "male",
        profile_pic: ""
      });
      setImageFile(null);

      setTimeout(() => {
        router.push("/list-doctors");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Doctor</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form onSubmit={addDoctor} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Doctor Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialty">Specialty</label>
          <input type="text" id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="experience">Experience (Years)</label>
          <input type="number" id="experience" name="experience" value={formData.experience} onChange={handleChange} required min="0" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rating">Rating</label>
          <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="profile_pic">Doctor Photo</label>
          <input type="file" id="profile_pic" name="profile_pic" accept="image/*" onChange={handleFileChange} required />
        </div>

        <button type="submit" className={styles.addBtn} disabled={loading}>
          {loading ? "Adding Doctor..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}
