const express = require("express");
const router = express.Router();

// Import all routes
const routes = {
    users: require("./usersRouter"),
    doctors: require("./doctorsRouter"),
    appointments: require("./appointmentsRouter"),
    admin: require("./adminRouter"), 
};

// Dynamically register routes
Object.entries(routes).forEach(([path, route]) => {
    router.use(`/${path}`, route);
});

module.exports = router;
