const express = require("express");
const passport = require("passport");
const db = require("../config/db.js");

const router = express.Router();

// Retrieve open time slots for a physician on a given day
router.get(
    "/available-slots/:doctorId/:date",
    passport.checkAuthentication,
    async (req, res) => {
      const { doctorId: physicianRef, date: appointmentDay } = req.params;
  
      try {
        // Query to fetch all time slots along with their availability status
        const slotAvailability = await db.any(
          `SELECT s.*, 
             CASE WHEN a.slot_id IS NULL THEN true ELSE false END as is_available
           FROM slots s
           LEFT JOIN (
             SELECT DISTINCT slot_id 
             FROM appointments 
             WHERE doctor_id = $1 
             AND appointment_date = $2 
             AND status IN ('pending', 'confirmed')
           ) a ON s.id = a.slot_id
           WHERE s.doctor_id = $1
           ORDER BY s.slot_time`,
          [physicianRef, appointmentDay]
        );
  
        return res.json(slotAvailability);
      } catch (error) {
        console.error("Error retrieving open slots:", error.message);
        return res.status(500).json({
          message: "Error retrieving open slots",
          error: error.message,
        });
      }
    }
  );
  
// Book an appointment with transaction support
router.post(
    "/book", 
    passport.checkAuthentication, 
    async (req, res) => {
      const { doctorId, slotId, appointmentType, appointmentDate } = req.body;
      const userId = req.user.user_id;
      
      try {
        // Use a transaction to ensure data consistency
        const result = await db.tx(async t => {
          // First verify the doctor exists
          const doctorExists = await t.oneOrNone(
            "SELECT 1 FROM doctors WHERE id = $1",
            [doctorId]
          );
          
          if (!doctorExists) {
            throw new Error("INVALID_DOCTOR");
          }
          
          // Check slot availability and existence in a single query
          const slotCheck = await t.oneOrNone(
            `SELECT s.id, 
              (SELECT COUNT(1) FROM appointments 
               WHERE slot_id = s.id 
               AND appointment_date = $3 
               AND status IN ('pending', 'confirmed')) as is_booked
             FROM slots s 
             WHERE s.id = $1 AND s.doctor_id = $2`,
            [slotId, doctorId, appointmentDate]
          );
          
          if (!slotCheck) {
            throw new Error("SLOT_NOT_FOUND");
          }
          
          if (slotCheck.is_booked > 0) {
            throw new Error("SLOT_ALREADY_BOOKED");
          }
          
          // Create the appointment
          return t.one(
            `INSERT INTO appointments 
              (user_id, doctor_id, slot_id, appointment_type, status, appointment_date)
             VALUES ($1, $2, $3, $4, 'pending', $5) 
             RETURNING *`,
            [userId, doctorId, slotId, appointmentType, appointmentDate]
          );
        });
        
        res.json({ 
          message: "Appointment booked successfully", 
          appointment: result 
        });
        
      } catch (error) {
        console.error("Error booking appointment:", error);
        
        // Handle specific error cases with proper status codes
        if (error.message === "INVALID_DOCTOR") {
          return res.status(404).json({ message: "Doctor not found" });
        } else if (error.message === "SLOT_NOT_FOUND") {
          return res.status(404).json({ message: "Slot not found or does not belong to this doctor" });
        } else if (error.message === "SLOT_ALREADY_BOOKED") {
          return res.status(400).json({ message: "Slot already booked for this date" });
        }
        
        return res.status(500).json({ 
          message: "Error booking appointment. Please try again later." 
        });
      }
    }
  );

// Fetch scheduled sessions for the logged-in user
router.get("/my-appointments", passport.checkAuthentication, async (req, res) => {
    const accountId = req.user.user_id; // User's unique identifier
    
    try {
        // Retrieve session details along with time slot information
        const sessionRecords = await db.any(
            `SELECT a.*, s.slot_time, s.slot_type 
             FROM appointments a
             JOIN slots s ON a.slot_id = s.id
             WHERE a.user_id = $1
             ORDER BY s.slot_time DESC`,
            [accountId]
        );

        res.json(sessionRecords);
    } catch (error) {
        console.error("Error fetching session records:", error);
        res.status(500).json({ message: "An error occurred while retrieving session records" });
    }
});

module.exports = router;