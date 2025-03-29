
const express = require("express");

const router = express.Router();

// Define route mappings in an object for better scalability
const routes = {
    users: require("./usersRouter"),
    doctors: require("./doctorsRouter"),
    appointments: require("./appointmentsRouter"),
};

// Dynamically register routes
Object.entries(routes).forEach(([path, route]) => {
    router.use(`/${path}`, route);
});

module.exports = router;
