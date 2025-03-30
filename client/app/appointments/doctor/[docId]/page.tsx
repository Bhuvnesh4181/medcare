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

const DoctorPage = () => {
    const { docId } = useParams();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchDoctor() {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:3001/api/doctors/doctor/${docId}`
                );

                const data: DoctorResponse = await res.json();

                if (!data.ok) {
                    console.log("No doctor found!");
                    return;
                }

                if (data.doctor) {
                    setDoctor(data.doctor);
                } else {
                    console.log("Doctor data structure not recognized");
                    setError("Doctor data structure not recognized");
                }
            } catch (err: any) {
                console.log("Failed to fetch doctor");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDoctor();
    }, [docId]);

    if (loading) {
        return <div>Loading doctor data...</div>;
    }

    if (error) {
        return <div>Error fetching doctor: {error}</div>;
    }

    if (!doctor) {
        return <div>No doctor found...</div>;
    }

    return (
        <DoctorDetails
            id={doctor.id}
            name={doctor.name}
            experience={doctor.experience}
            profile_pic={doctor.profile_pic}
            rating={doctor.rating}
            specialty={doctor.specialty}
        />
    );
};

export default DoctorPage;