const express = require("express");

const router = express.Router();

const usersRouter = require("./usersRouter");
router.use("/users", usersRouter);

const doctorsRouter = require("./doctorsRouter");
router.use("/doctors", doctorsRouter);

const appointmentsRouter = require("./appointmentsRouter");
router.use("/appointments", appointmentsRouter);

module.exports = router;