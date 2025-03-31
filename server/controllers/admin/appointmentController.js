const db = require('../../config/db');
const sendApprovalEmail=require('../../config/mailer')
// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.any(`
       SELECT 
                a.id,
                a.appointment_date,
                s.slot_time,
                a.slot_id,
                a.status,
                d.id as doctor_id,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                u.user_id as user_id,
                u.user_name as username,
                u.user_emailid as user_emailid
            FROM appointments a
            join slots s on a.slot_id=s.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON a.user_id = u.user_id
            WHERE a.status = 'pending'  -- Only fetch pending appointments
            ORDER BY a.appointment_date DESC, a.slot_id ASC
        `);
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

// Get pending appointments
exports.getPendingAppointments = async (req, res) => {
    try {
        const appointments = await db.any(`
                    SELECT 
                a.id AS appointment_id,
                a.doctor_id,
                a.user_id,
                a.appointment_type AS mode_of_appointment,
                a.appointment_date,
                a.status,
                s.slot_time AS time_slot,
                d.name AS doctor_name,
                d.profile_pic AS doctor_photo,
                d.specialty
            FROM appointments a
            LEFT JOIN slots s ON a.slot_id = s.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.status = 'pending'
            ORDER BY a.appointment_date DESC;

        `);
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching pending appointments:", error.message);
        res.status(500).json({ message: 'Error fetching pending appointments', error: error.message });
    }
};
// Accept appointment
exports.acceptAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the appointment status
        const appointment = await db.one(
            `UPDATE appointments 
             SET status = 'confirmed'
             WHERE id = $1
             RETURNING id, user_id, doctor_id, status`,
            [id]
        );

        // Send the response immediately before running the email function
        res.json({
            message: "Appointment confirmed successfully",
            appointment,
        });

        // Fetch user details **after sending the response**
        const user = await db.one(
            `SELECT user_name, user_emailid 
             FROM users 
             WHERE user_id = $1`,
            [appointment.user_id]
        );

        // Send confirmation email in the background
        if (user.user_emailid) {
            sendApprovalEmail(user.user_emailid, user.user_name)
                .then(() => console.log("Email sent successfully"))
                .catch((error) => console.error("Email sending failed:", error));
        }

    } catch (error) {
        console.error("Error accepting appointment:", error.message);
        res.status(500).json({ message: 'Error accepting appointment', error: error.message });
    }
};

// Reject appointment
exports.rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.one(
            `UPDATE appointments 
             SET status = 'rejected'
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        res.json(appointment);
    } catch (error) {
        console.error("Error rejecting appointment:", error.message);
        res.status(500).json({ message: 'Error rejecting appointment', error: error.message });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.none('DELETE FROM appointments WHERE id = $1', [id]);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error("Error deleting appointment:", error.message);
        res.status(500).json({ message: 'Error deleting appointment', error: error.message });
    }
}; 