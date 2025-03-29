require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("./config/passport-google-oauth");
require("./config/passport-local-strategy");

const indexRouter = require("./routes/index");

const app = express();
const port = process.env.PORT || 3001;

// CORS Configuration
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from frontend
        credentials: true, // Allow cookies/sessions
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "medcare-app-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true in production (requires HTTPS)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
    })
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", indexRouter);

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));
