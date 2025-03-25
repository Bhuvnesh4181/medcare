"use client";
 
 import Appointment from "@/app/_Components/appointment/appointmentComp";
 import { useParams } from "next/navigation";
 import { useEffect, useState } from "react";
 import { doctors } from "@/app/_Components/CardsGrid/ShowCards";
 
 interface Doctor {
     id: number;
     name: string;
     degree: string;
     specialty: string;
     experience: string;
     rating: number;
     image: string;
     designation?: string;
     hospital?: string;
     about?: string;
     education?: string[];
     nextAvailable?: string;
 }
 
 export default function DynamicBookingPage() {
     const params = useParams();
     const [doctor, setDoctor] = useState<Doctor | null>(null);
 
     useEffect(() => {
         const doctorId = parseInt(params.id as string);
         const foundDoctor = doctors.find(doc => doc.id === doctorId);
         setDoctor(foundDoctor || null);
     }, [params.id]);
 
     if (!doctor) return <div>Loading...</div>;
 
     return <Appointment doctor={doctor} />;
 } 