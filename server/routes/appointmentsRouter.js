
const express = require("express");
const passport = require("passport");
const db = require("../config/db.js");

const router = express.Router();

// Fetch available slots for a doctor on a specific date
router.get(
    "/available-slots/:doctorId/:date",
    passport.checkAuthentication,
    async (req, res) => {
        const { doctorId, date } = req.params;
        try {
            const [slots, unavailableSlots] = await Promise.all([
                db.any(
                    `SELECT * FROM slots 
                     WHERE doctor_id = $1
                     ORDER BY slot_time`,
                    [doctorId]
                ),
                db.any(
                    `SELECT slot_id 
                     FROM appointments 
                     WHERE doctor_id = $1 
                     AND appointment_date = $2
                     AND status IN ('pending', 'confirmed')`,
                    [doctorId, date]
                ),
            ]);

            const unavailableSlotIds = new Set(unavailableSlots.map(slot => slot.slot_id));
            const availableSlots = slots.map(slot => ({
                ...slot,
                is_available: !unavailableSlotIds.has(slot.id),
            }));

            return res.json(availableSlots);
        } catch (error) {
            console.error("Error getting available slots:", error.message);
            return res.status(500).json({ message: "Error getting available slots", error: error.message });
        }
    }
);

// Book an appointment
router.post("/book", passport.checkAuthentication, async (req, res) => {
    const { doctorId, slotId, appointmentType, appointmentDate } = req.body;
    const userId = req.user.user_id;

    try {
        const [existingAppointment, slot] = await Promise.all([
            db.oneOrNone(
                `SELECT 1 FROM appointments 
                 WHERE slot_id = $1 AND appointment_date = $2
                 AND status IN ('pending', 'confirmed')`,
                [slotId, appointmentDate]
            ),
            db.oneOrNone(
                `SELECT 1 FROM slots WHERE id = $1 AND doctor_id = $2`,
                [slotId, doctorId]
            ),
        ]);

        if (existingAppointment) {
            return res.status(400).json({ message: "Slot already booked for this date" });
        }
        if (!slot) {
            return res.status(404).json({ message: "Slot not found or does not belong to this doctor" });
        }

        const appointment = await db.one(
            `INSERT INTO appointments (user_id, doctor_id, slot_id, appointment_type, status, appointment_date) 
             VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
            [userId, doctorId, slotId, appointmentType, appointmentDate]
        );

        res.json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).json({ message: "Error booking appointment. Please try again later." });
    }
});

// Retrieve user's appointments
router.get("/my-appointments", passport.checkAuthentication, async (req, res) => {
    const userId = req.user.user_id;
    try {
        const appointments = await db.any(
            `SELECT a.*, s.slot_time, s.slot_type 
             FROM appointments a
             JOIN slots s ON a.slot_id = s.id
             WHERE a.user_id = $1
             ORDER BY s.slot_time DESC`,
            [userId]
        );
        res.json(appointments);
    } catch (error) {
        console.error("Error getting appointments:", error);
        res.status(500).json({ message: "Error getting appointments" });
    }
});

module.exports = router;
