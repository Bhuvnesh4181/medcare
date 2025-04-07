const express = require('express');
const router = express.Router();
const {
    getAllAppointments,
    acceptAppointment,
    rejectAppointment,
    deleteAppointment
} = require('../../controllers/admin/appointmentController');


router.get('/', getAllAppointments);
router.put('/:id/accept', acceptAppointment);
router.put('/:id/reject', rejectAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;