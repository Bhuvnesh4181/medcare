"use client";
import { useState } from "react";
import styles from "./DoctorForm.module.css";
import { useRouter } from "next/navigation";

interface DoctorFormProps {
  onDoctorAdded: (doctor: any) => void;
}

interface FormData {
  name: string;
  specialty: string;
  experience: string;
  rating: string;
  location: string;
  gender: string;
}

export default function DoctorForm({ onDoctorAdded }: DoctorFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    specialty: "",
    experience: "",
    rating: "",
    location: "",
    gender: "male",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Form fields array for dynamic rendering
  const formFields = [
    { label: "Doctor Name", name: "name", type: "text", required: true },
    { label: "Specialty", name: "specialty", type: "text", required: true },
    { label: "Experience (Years)", name: "experience", type: "number", required: true, min: 0 },
    { label: "Rating", name: "rating", type: "number", min: 0, max: 5 },
    { label: "Location", name: "location", type: "text", required: true },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!imageFile) throw new Error("Please select an image");

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });
      formDataToSend.append("profile_pic", imageFile);

      const response = await fetch("http://localhost:3001/api/admin/doctors/create", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to add doctor");

      setMessage({ type: "success", text: "Doctor added successfully!" });
      setFormData({ name: "", specialty: "", experience: "", rating: "", location: "", gender: "male" });
      setImageFile(null);

      setTimeout(() => router.push("/list-doctors"), 2000);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to add doctor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Doctor</h2>
      {message && <div className={message.type === "error" ? styles.error : styles.success}>{message.text}</div>}
      
      <form onSubmit={addDoctor} className={styles.form}>
        {formFields.map(({ label, name, type, ...rest }) => (
          <div key={name} className={styles.formGroup}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} value={formData[name as keyof FormData]} onChange={handleChange} {...rest} />
          </div>
        ))}

        {/* Gender Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            {["male", "female", "other"].map((option) => (
              <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* File Upload */}
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
