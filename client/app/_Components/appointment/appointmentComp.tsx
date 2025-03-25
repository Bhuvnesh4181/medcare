"use client";

import Calendar from "../Calender/showCalender";
import style from "./booking.module.css";
import { useState, useEffect } from "react";

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

interface AppointmentProps {
    doctor: Doctor;
}

export default function Appointment({ doctor }: AppointmentProps) {
    const [offileGreen, setOffineGreen] = useState(true);
    const [HospitalList, setHospitalList] = useState([
        "MediCareHeart Institute, Okhla Road",
    ]);
    const [slotsAvailable, setSlotsAvailable] = useState([
        { time: "9:00 AM", isAvailable: true },
        { time: "10:00 AM", isAvailable: true },
        { time: "11:00 AM", isAvailable: true },
        { time: "11:30 AM", isAvailable: false },
        { time: "12:00 PM", isAvailable: true },
        { time: "12:30 PM", isAvailable: false },
        { time: "1:00 PM", isAvailable: true },
        { time: "1:30 PM", isAvailable: true },
    ]);
    const [slotsAvailableE, setSlotsAvailableE] = useState([
        { time: "4:00 PM", isAvailable: true },
        { time: "4:30 PM", isAvailable: false },
        { time: "5:00 PM", isAvailable: true },
        { time: "5:30 PM", isAvailable: true },
        { time: "6:00 PM", isAvailable: true },
        { time: "6:30 PM", isAvailable: false },
        { time: "7:00 PM", isAvailable: true },
        { time: "7:30 PM", isAvailable: false },
    ]);
    const [slotSelected, setSlotSelected] = useState(-1);
    const [slotSelectedE, setSlotSelectedE] = useState(-1);
    const [count, setCount] = useState(0);
    const [countE, setCountE] = useState(0);
    const [modeSelected, setModeSelected] = useState(0);

    useEffect(() => {
        let temp = 0;
        slotsAvailable.forEach((data) => {
            if (data.isAvailable) temp++;
        });
        setCount(temp);
    }, []);

    useEffect(() => {
        let temp2 = 0;
        slotsAvailableE.forEach((data) => {
            if (data.isAvailable) temp2++;
        });
        setCountE(temp2);
    }, []);

    function handleToggle(i: number) {
        if (i === 1 && offileGreen) {
            return;
        } else if (i === 2 && !offileGreen) {
            return;
        }
        setOffineGreen(!offileGreen);
        setModeSelected(i);
    }

    function handleSlotSelection(i: number) {
        setSlotSelected(i);
        if (slotSelectedE !== -1) setSlotSelectedE(-1);
    }

    function handleSlotSelectionE(i: number) {
        setSlotSelectedE(i);
        if (slotSelected !== -1) setSlotSelected(-1);
    }

    function handleNext() {
        //handleNext
    }

    return (
        <main className={style.main}>
            <div className={style.info}>
                <h1>Book your next doctor's visit in Seconds</h1>
                <p>
                    Medcare helps you find the best healthcare provider by
                    specialty, location, and more, ensuring you get the care you
                    need.
                </p>
            </div>
            <div className={style.slotsBackground}>
                <div className={style.slots}>
                    <div className={style.schedule}>
                        <p>Schedule Appointment</p>
                        <button>Book Appointment</button>
                    </div>
                    <div className={style.consult}>
                        <button
                            className={offileGreen ? style.bgGreen : style.White}
                            onClick={() => handleToggle(1)}
                        >
                            Book Video Consult
                        </button>
                        <button
                            className={!offileGreen ? style.bgGreen : style.White}
                            onClick={() => handleToggle(2)}
                        >
                            Book Hospital Visit
                        </button>
                    </div>
                    <select className={style.hospitalList}>
                        <option>{HospitalList[0]}</option>
                    </select>
                    <Calendar/>
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sun}></div>
                                <div className={style.morning}>Morning</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span> Slots {count} </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {slotsAvailable.map((data, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSlotSelection(i)}
                                    className={`${i === slotSelected ? style.bgGreen : style.bgWhite} ${
                                        !data.isAvailable ? style.disabled : ''
                                    }`}
                                >
                                    {data.time}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sunset}></div>
                                <div className={style.morning}>Evening</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span> Slots {countE} </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {slotsAvailableE.map((data, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSlotSelectionE(i)}
                                    className={`${i === slotSelectedE ? style.bgGreen : style.bgWhite} ${
                                        !data.isAvailable ? style.disabled : ''
                                    }`}
                                >
                                    {data.time}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        className={style.nextButton}
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}