"use client";

import { Doctor } from "@/app/_Components/CardsGrid/ShowCards";
import DoctorDetails from "@/app/_Components/DetailPage/DoctorDetail";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DoctorResponse {
    ok: boolean;
    doctor?: Doctor;
    message?: string;
}

const DoctorPage: React.FC = () => {
    const { docId } = useParams<{ docId: string }>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!docId) {
            setError("Invalid doctor ID.");
            setLoading(false);
            return;
        }

        const fetchDoctor = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/doctors/doctor/${docId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch doctor details.");
                }

                const data: DoctorResponse = await response.json();

                if (!data.ok || !data.doctor) {
                    throw new Error(data.message || "Doctor not found.");
                }

                setDoctor(data.doctor);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [docId]);

    if (loading) return <div>Loading doctor data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!doctor) return <div>No doctor found.</div>;

    return (
        <DoctorDetails
            id={doctor.id.toString()}
            name={doctor.name}
            experience={Number(doctor.experience) || 0} // Ensures valid number
            profile_pic={doctor.profile_pic}
            rating={Number(doctor.rating) || 0} // Ensures valid number
            specialty={doctor.specialty}
        />
    );
};

export default DoctorPage;
