const db = require('../../config/db');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.any(`
      SELECT 
    a.id,
    a.user_id,
    u.user_name AS patient_name,
    a.doctor_id,
    d.user_name AS doctor_name,  -- Assuming doctors are also stored in users table
    a.slot_id,
    a.appointment_type AS mode_of_appointment,
    a.appointment_date,
    a.status,
    s.slot_time
FROM appointments a
LEFT JOIN slots s ON a.slot_id = s.id
LEFT JOIN users u ON a.user_id = u.user_id  -- Ensure the user table is correctly joined
LEFT JOIN users d ON a.doctor_id = d.user_id  -- Ensure doctor details are retrieved correctly
WHERE a.status = 'pending'
ORDER BY a.appointment_date DESC;


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
        const appointment = await db.one(
            `UPDATE appointments 
             SET status = 'confirmed'
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        res.json(appointment);
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