# Doctor Appointment Web Application

## Overview
This is a **Doctor Appointment Booking Web Application** where users can book **virtual or physical** appointments with doctors. However, appointments follow a **request-based system**, where a **Super Admin** approves or rejects them. The system consists of two applications:

1. **Main Website** - For users to register, browse doctors, and request appointments.
2. **Backend** - Handles authentication, appointments, and database operations.

## Tech Stack
- **Frontend:** Next.js (React framework)
- **Backend:** Express.js
- **Database:** PostgreSQL
- **Authentication:** Passport.js
- **Storage:** Cloudinary (for doctor profile pictures)

## Features
### **User Side (Main Website)**
- **User Registration & Authentication**
- **Browse Doctors (with Pagination & Filters)**
- **View Doctor Profile (Rating, Availability, Specialization, etc.)**
- **Request Appointments** (Choose Date, Time Slot, Virtual/Physical)
- **View Appointment Status** (Pending/Confirmed/Rejected)

### **Admin Functionality**
- **Super Admin Panel** to manage doctors, users, and appointments.
- **Approve or Reject Appointments** based on doctor availability.
- **Manage Doctor Profiles** (Add, Update, Delete Doctors).
- **View Reports & Analytics** on total appointments, doctor availability, and user engagement.

## Database Schema
### **Users Table**
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_emailid TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    age INT NOT NULL,
    role TEXT CHECK (role IN ('user', 'admin', 'super_admin')) DEFAULT 'user'
);
```
### **Doctors Table**
```sql
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    rating FLOAT CHECK (rating >= 0 AND rating <= 5),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    profile_pic TEXT DEFAULT 'https://res.cloudinary.com/dy0nfmpxp/image/upload/f_auto,q_auto/aaoibh83b7mzneawwxvw'
);
```
### **Slots Table**
```sql
CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL,
    slot_type TEXT CHECK (slot_type IN ('morning', 'evening')),
    is_booked BOOLEAN DEFAULT FALSE
);
```
### **Appointments Table**
```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
    slot_id INT REFERENCES slots(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'rejected')) DEFAULT 'pending'
);
```

## Setup Instructions
### **1. Clone Repository**
```sh
git clone https://github.com/your-repo/doctor-appointment.git
cd doctor-appointment
```

### **2. Install Dependencies**
```sh
npm install  # For frontend (Next.js) & backend (Express.js)
```

### **3. Setup PostgreSQL Database**
```sql
CREATE DATABASE doctor_appointments;
```
Set up the `.env` file with the database connection URL.

### **4. Run Backend**
```sh
cd backend
node server.js
```

### **5. Run Frontend**
```sh
cd frontend
npm run dev
```

## Deployment
- **Frontend:** Vercel / Netlify
- **Backend:** Render / DigitalOcean / AWS
- **Database:** Supabase / PostgreSQL Server

## Future Enhancements
- **Doctor Search by Specialization**
- **Email Notifications for Appointments**
- **Real-Time Appointment Updates using WebSockets**
- **Multi-Role Authentication for Admins and Super Admins**
- **Audit Logs for Admin Actions**

## License
This project is open-source under the MIT License.

---
### 🚀 Ready to Get Started? Happy Coding! 😃

