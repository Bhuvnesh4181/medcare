"use client";
 import { doctors } from "../../_Components/CardsGrid/ShowCards";
 import DoctorPage from "../../_Components/DetailPage/DoctorDetail";
 import { notFound } from "next/navigation";
 import { use } from "react";
 
 export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = use(params);
     const doctor = doctors.find(d => d.id === parseInt(id));
     
     if (!doctor) {
         notFound();
     }
 
     return <DoctorPage doctor={doctor} />;
 } 