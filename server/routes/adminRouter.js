const express = require('express');
const router = express.Router();
const doctorRoutes = require('./admin/doctorRoutes');
const appointmentRoutes = require('./admin/appointmentRoutes');

// Mount the routes
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
