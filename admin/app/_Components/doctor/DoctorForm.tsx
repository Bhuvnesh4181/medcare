// "use client";
// import { useState } from "react";
// import styles from "./DoctorForm.module.css";
// import { useRouter } from "next/navigation";

// export default function DoctorForm({ onDoctorAdded }: { onDoctorAdded: (doctor: any) => void }) {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     doctor_name: "",
//     degree: "",
//     speciality: "",
//     experience_years: "",
//     location: "",
//     available_time: "",
//     ratings: "",
//     gender: "Male",
//     image: ""
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImageFile(e.target.files[0]);
//     }
//   };

//   const addDoctor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       if (!imageFile) {
//         throw new Error("Please select an image");
//       }

//       // Create FormData and append all fields
//       const formDataToSend = new FormData();
//       formDataToSend.append("doctor_name", formData.doctor_name);
//       formDataToSend.append("degree", formData.degree);
//       formDataToSend.append("speciality", formData.speciality);
//       formDataToSend.append("experience_years", formData.experience_years);
//       formDataToSend.append("location", formData.location);
//       formDataToSend.append("available_time", formData.available_time || "Not Available");
//       formDataToSend.append("ratings", formData.ratings || "0");
//       formDataToSend.append("gender", formData.gender);
//       formDataToSend.append("doctor_photo", imageFile);

//       console.log("Sending data:", Object.fromEntries(formDataToSend.entries()));

//       // Send data to backend
//       const response = await fetch("http://localhost:3001/api/admin/doctors/create", {
//         method: "POST",
//         credentials: "include",
//         body: formDataToSend,
//       });

//       const responseText = await response.text();
//       console.log("Raw response:", responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (err) {
//         console.error("Failed to parse response:", responseText);
//         throw new Error("Server returned invalid JSON response");
//       }

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to add doctor");
//       }

//       setSuccess("Doctor added successfully!");
      
//       // Clear form
//       setFormData({
//         doctor_name: "",
//         degree: "",
//         speciality: "",
//         experience_years: "",
//         location: "",
//         available_time: "",
//         ratings: "",
//         gender: "Male",
//         image: ""
//       });
//       setImageFile(null);

//       // Wait for 2 seconds before redirecting
//       setTimeout(() => {
//         router.push("/admin/app/doctors");
//       }, 2000);
//     } catch (err) {
//       console.error("Error adding doctor:", err);
//       setError(err instanceof Error ? err.message : "Failed to add doctor");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Add Doctor</h2>
//       {error && <div className={styles.error}>{error}</div>}
//       {success && <div className={styles.success}>{success}</div>}
//       <form onSubmit={addDoctor} className={styles.form}>
//         <div className={styles.formGroup}>
//           <label htmlFor="doctor_name">Doctor Name</label>
//           <input
//             type="text"
//             id="doctor_name"
//             name="doctor_name"
//             value={formData.doctor_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="degree">Degree</label>
//           <input
//             type="text"
//             id="degree"
//             name="degree"
//             value={formData.degree}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="speciality">Speciality</label>
//           <input
//             type="text"
//             id="speciality"
//             name="speciality"
//             value={formData.speciality}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="experience_years">Experience (Years)</label>
//           <input
//             type="number"
//             id="experience_years"
//             name="experience_years"
//             value={formData.experience_years}
//             onChange={handleChange}
//             required
//             min="0"
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="location">Location</label>
//           <input
//             type="text"
//             id="location"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="available_time">Available Time</label>
//           <input
//             type="text"
//             id="available_time"
//             name="available_time"
//             value={formData.available_time}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="ratings">Ratings</label>
//           <input
//             type="number"
//             id="ratings"
//             name="ratings"
//             value={formData.ratings}
//             onChange={handleChange}
//             min="0"
//             max="5"
//           />
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="gender">Gender</label>
//           <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="doctor_photo">Doctor Photo</label>
//           <input
//             type="file"
//             id="doctor_photo"
//             name="doctor_photo"
//             accept="image/*"
//             onChange={handleFileChange}
//             required
//           />
//         </div>

//         <button type="submit" className={styles.addBtn} disabled={loading}>
//           {loading ? "Adding Doctor..." : "Add Doctor"}
//         </button>
//       </form>
//     </div>
//   );
// }


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
    gender: "female",
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
        gender: "female",
        profile_pic: ""
      });
      setImageFile(null);

      setTimeout(() => {
        router.push("/admin/app/doctors");
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
