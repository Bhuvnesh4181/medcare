const db = require('../../config/db');
const sendApprovalEmail=require('../../config/mailer')

exports.acceptAppointment = async (req, res) => {
    try {
        const { id: appointmentId } = req.params;
    
        // Update appointment status and retrieve user details in query
        const updatedAppointment = await db.one(
            `UPDATE appointments 
             SET status = 'confirmed'
             FROM users 
             WHERE appointments.id = $1 
               AND users.user_id = appointments.user_id
             RETURNING appointments.id, appointments.user_id, appointments.doctor_id, 
                       users.user_name AS patient_name, users.user_emailid AS patient_email, appointments.status`,
            [appointmentId]
        );
    
        // Send success response before triggering the email
        res.json({
            message: "Appointment successfully confirmed",
            appointment: updatedAppointment,
        });
    
        // Send confirmation email asynchronously
        if (updatedAppointment.patient_email) {
            sendApprovalEmail(updatedAppointment.patient_email, updatedAppointment.patient_name)
                .then(() => console.log("Confirmation email sent successfully"))
                .catch((error) => console.error("Failed to send confirmation email:", error));
        }
    
    } catch (error) {
        console.error("Error confirming appointment:", error.message);
        res.status(500).json({ message: "Error confirming appointment", error: error.message });
    }
    
};


// Reject appointment
exports.rejectAppointment = async (req, res) => {
    try {
        const { id: appointmentId } = req.params;
        const updatedAppointment = await db.one(
            `UPDATE appointments 
             SET status = 'rejected'
             WHERE id = $1
             RETURNING *`,
            [appointmentId]
        );
        res.json(updatedAppointment);
    } catch (error) {
        console.error("Error declining appointment:", error.message);
        res.status(500).json({ message: 'Error declining appointment', error: error.message });
    }
    
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const { id: appointmentId } = req.params;
        await db.none('DELETE FROM appointments WHERE id = $1', [appointmentId]);
        res.json({ message: 'Appointment removed successfully' });
    } catch (error) {
        console.error("Error removing appointment:", error.message);
        res.status(500).json({ message: 'Error removing appointment', error: error.message });
    }    
}; 


exports.getAllAppointments = async (req, res) => {
    try {
        const pendingAppointments= await db.any(`
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
             res.json(pendingAppointments);
        } catch (error) {
            console.error("Error retrieving pending appointments:", error.message);
            res.status(500).json({ message: "Error retrieving pending appointments", error: error.message });
        }
};