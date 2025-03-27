"use client";
import { useState } from "react";
import styles from "./DoctorForm.module.css";

export default function DoctorForm({ onDoctorAdded }: { onDoctorAdded: (doctor: any) => void }) {
  const [newDoctor, setNewDoctor] = useState({ 
    name: "", specialty: "", email: "", phone: "", qualification: "", location: "", experience: "", image: "" 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "your_upload_preset"); // Replace with Cloudinary preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const addDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.email || !newDoctor.phone || !newDoctor.qualification || !newDoctor.location || !newDoctor.experience) return;

    setLoading(true);
    const imageUrl = await uploadImageToCloudinary();
    setLoading(false);

    const doctorData = { ...newDoctor, id: Date.now(), image: imageUrl || "" };
    onDoctorAdded(doctorData);

    setNewDoctor({ name: "", specialty: "", email: "", phone: "", qualification: "", location: "", experience: "", image: "" });
    setImageFile(null);
  };

  return (
    <div className={styles.container}>
      <h2>Add Doctor</h2>
      <div className={styles.form}>
        <input type="text" name="name" placeholder="Doctor Name" value={newDoctor.name} onChange={handleChange} />
        <input type="text" name="specialty" placeholder="Specialty" value={newDoctor.specialty} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={newDoctor.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={newDoctor.phone} onChange={handleChange} />
        <input type="text" name="qualification" placeholder="Qualification" value={newDoctor.qualification} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={newDoctor.location} onChange={handleChange} />
        <input type="text" name="experience" placeholder="Experience (e.g., 5 years)" value={newDoctor.experience} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={addDoctor} className={styles.addBtn} disabled={loading}>
          {loading ? "Uploading..." : "Add Doctor"}
        </button>
      </div>
    </div>
  );
}



