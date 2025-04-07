const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const seedAdmin = require("./seeds/adminSeed");
const indexRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || "default-secret-key";

// Configure CORS
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax",
        path: "/",
        domain: "localhost",
    },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// Mount API routes
app.use("/api", indexRouter);

// Seed admin user
(async () => {
    try {
        await seedAdmin();
        console.log("✅ Admin seeding completed.");
    } catch (error) {
        console.error("❌ Error during admin seeding:", error);
    }
})();

// Start server
try {
    app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
} catch (error) {
    console.error("❌ Server failed to start:", error);
}
