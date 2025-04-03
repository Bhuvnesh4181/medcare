const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../config/db.js");
const { handleError } = require("../utils/errorHandler.js");
const { ensureAuthenticated } = require("../middlewares/authMiddleware.js");

require("../config/passport-local-strategy.js");
require("../config/passport-google-oauth.js");

const router = express.Router();

// Check authentication status
router.get("/me", ensureAuthenticated, (req, res) => {
    res.json(req.user);
});

// Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await db.oneOrNone("SELECT * FROM users WHERE user_emailid=$1", [email]);
        if (existingUser) return res.status(400).json({ ok: false, message: "User already exists" });

        const hashedPw = await bcrypt.hash(password, 10);
        const newUser = await db.one(
            "INSERT INTO users(user_name, user_emailid, password) VALUES($1, $2, $3) RETURNING user_id, user_name, user_emailid",
            [name, email, hashedPw]
        );

    } catch (error) {
        handleError(res, "Registration failed", error);
    }
});

// Local login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return handleError(res, "Internal server error", err);
        if (!user) return res.status(401).json({ ok: false, message: info?.message || "Authentication failed" });

        req.logIn(user, (err) => {
            if (err) return handleError(res, "Login failed", err);
            res.status(200).json({ ok: true, user });
        });
    })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return handleError(res, "Logout failed", err);
        res.json({ ok: true, message: "Logged out successfully" });
    });
});

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => res.redirect("http://localhost:3000/auth/google/callback")
);

module.exports = router;
