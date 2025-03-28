const express = require("express");
const passport = require("passport");
const db = require("../config/db.js");

const router = express.Router();

// Get available slots for a doctor on a specific date
router.get(
    "/available-slots/:doctorId/:date",
    passport.checkAuthentication,
    async (req, res) => {
        const { doctorId, date } = req.params;
        try {
            // Get all slots for the doctor
            const slots = await db.any(
                `SELECT * FROM slots 
                 WHERE doctor_id = $1
                 ORDER BY slot_time`,
                [doctorId]
            );

            // Get slots with pending or confirmed appointments
            const unavailableSlots = await db.any(
                `SELECT slot_id FROM appointments 
                 WHERE doctor_id = $1 
                 AND status IN ('pending', 'confirmed')`,
                [doctorId]
            );

            // Mark slots as unavailable if they have pending or confirmed appointments
            const availableSlots = slots.map((slot) => ({
                ...slot,
                is_available: !unavailableSlots.some(
                    (booked) => booked.slot_id === slot.id
                ),
            }));

            return res.json(availableSlots);
        } catch (error) {
            console.error("Error getting available slots:", error);
            return res.status(500).json({
                message: "Error getting available slots",
                error: error.message,
            });
        }
    }
);

// Book an appointment
router.post("/book", passport.checkAuthentication, async (req, res) => {
    const { doctorId, slotId, appointmentType } = req.body;
    const userId = req.user.id; // From passport authentication

    try {
        // Check if slot is already booked
        const existingAppointment = await db.oneOrNone(
            `SELECT * FROM appointments 
             WHERE slot_id = $1 
             AND status IN ('pending', 'confirmed')`,
            [slotId]
        );

        if (existingAppointment) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        // Create new appointment
        const appointment = await db.one(
            `INSERT INTO appointments 
             (user_id, doctor_id, slot_id, appointment_type, status) 
             VALUES ($1, $2, $3, $4, 'pending') 
             RETURNING *`,
            [userId, doctorId, slotId, appointmentType]
        );

        res.json(appointment);
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Error booking appointment" });
    }
});

// Get user's appointments
router.get(
    "/my-appointments",
    passport.checkAuthentication,
    async (req, res) => {
        const userId = req.user.id;
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
    }
);

module.exports = router;