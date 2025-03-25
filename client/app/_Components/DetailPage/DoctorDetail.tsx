"use client"
 import Image from 'next/image';
 import styles from './Doctordetail.module.css';
 import { useState } from 'react';
 import Link from 'next/link';
 
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
     awards?: string[];
     publications?: string[];
     languages?: string[];
     about?: string;
     education?: string[];
     consultationFee?: number;
     availableSlots?: {
         morning: string[];
         evening: string[];
     };
 }
 interface DoctorPageProps {
     doctor: Doctor;
 }
 
 export default function DoctorPage({ doctor }: DoctorPageProps) {
     const [activeTab, setActiveTab] = useState<'about' | 'education' | 'publications'>('about');
     const [appointmentType, setAppointmentType] = useState<'video' | 'hospital'>('hospital');
 
     return (
         <div className={styles.container}>
             <div className={styles.header}>
                 <div className={styles.doctorInfo}>
                     <div className={styles.imageContainer}>
                         <Image
                             src={doctor.image}
                             alt={doctor.name}
                             width={200}
                             height={200}
                             className={styles.doctorImage}
                         />
                     </div>
                     <div className={styles.basicInfo}>
                         <h1>{doctor.name}</h1>
                         <p className={styles.designation}>{doctor.designation || `${doctor.specialty} | ${doctor.degree}`}</p>
                         <p className={styles.experience}>{doctor.experience} Experience</p>
                         <div className={styles.ratingContainer}>
                             {Array.from({ length: 5 }, (_, index) => (
                                 <Image
                                     key={index}
                                     src={index < doctor.rating ? "/star.svg" : "/blankStar.svg"}
                                     alt="star"
                                     width={20}
                                     height={20}
                                 />
                             ))}
                         </div>
                         <p className={styles.hospital}>{doctor.hospital || 'MediCare Hospital'}</p>
                         <p className={styles.fee}>₹{doctor.consultationFee || 2800} Consultation fee</p>
                     </div>
                 </div>
                 <div className={styles.actions}>
                     <Link href={`/bookingpage/${doctor.id}`}>
                         <button 
                             className={`${styles.actionButton} ${appointmentType === 'hospital' ? styles.active : ''}`}
                             onClick={() => setAppointmentType('hospital')}
                         >
                             Book Appointment
                         </button>
                     </Link>
                     
                 </div>
             </div>
 
             <div className={styles.content}>
                 <div className={styles.tabs}>
                     <button 
                         className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
                         onClick={() => setActiveTab('about')}
                     >
                         About
                     </button>
                     <button 
                         className={`${styles.tab} ${activeTab === 'education' ? styles.activeTab : ''}`}
                         onClick={() => setActiveTab('education')}
                     >
                         Education & Experience
                     </button>
                     <button 
                         className={`${styles.tab} ${activeTab === 'publications' ? styles.activeTab : ''}`}
                         onClick={() => setActiveTab('publications')}
                     >
                         Publications & Awards
                     </button>
                 </div>
 
                 <div className={styles.tabContent}>
                     {activeTab === 'about' && (
                         <div className={styles.aboutSection}>
                             <h2>About {doctor.name}</h2>
                             <p>{doctor.about || `${doctor.name} is a highly skilled ${doctor.specialty} with ${doctor.experience} of experience in treating patients with various conditions. They are known for their patient-centric approach and expertise in the field.`}</p>
                             
                             <h3>Languages</h3>
                             <div className={styles.languages}>
                                 {(doctor.languages || ['English', 'Hindi']).map((lang, index) => (
                                     <span key={index} className={styles.language}>{lang}</span>
                                 ))}
                             </div>
                         </div>
                     )}
 
                     {activeTab === 'education' && (
                         <div className={styles.educationSection}>
                             <h2>Education</h2>
                             <ul className={styles.educationList}>
                                 {(doctor.education || [`${doctor.degree} - Top Medical College`]).map((edu, index) => (
                                     <li key={index}>{edu}</li>
                                 ))}
                             </ul>
                         </div>
                     )}
 
                     {activeTab === 'publications' && (
                         <div className={styles.publicationsSection}>
                             <h2>Awards & Recognition</h2>
                             <ul className={styles.awardsList}>
                                 {(doctor.awards || ['Excellence in Medical Practice Award']).map((award, index) => (
                                     <li key={index}>{award}</li>
                                 ))}
                             </ul>
 
                             <h2>Publications</h2>
                             <ul className={styles.publicationsList}>
                                 {(doctor.publications || ['Various research papers in leading medical journals']).map((pub, index) => (
                                     <li key={index}>{pub}</li>
                                 ))}
                             </ul>
                         </div>
                     )}
                 </div>
             </div>
         </div>
     );
 } 