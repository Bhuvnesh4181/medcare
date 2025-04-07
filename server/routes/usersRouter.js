const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const database = require("../config/db.js");

require("../config/passport-local-strategy.js");
require("../config/passport-google-oauth.js");

const authRouter = express.Router();

// Helper function for error handling
const handleRequestError = (response, message, error = null, statusCode = 500) => {
    console.error(message, error?.message || "");
    return response.status(statusCode).json({ ok: false, message });
};

// Check authentication status
authRouter.get("/me", (request, response) => {
    return request.isAuthenticated()
        ? response.json(request.user)
        : response.status(401).json({ message: "Not authenticated" });
});

// Register a new user
authRouter.post("/register", async (request, response) => {
    const { name, email, password } = request.body;

    try {
        const existingAccount = await database.oneOrNone(
            "SELECT * FROM users WHERE user_emailid=$1",
            [email]
        );

        if (existingAccount) {
            return response.status(400).json({ ok: false, message: "User already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const createdUser = await database.one(
            "INSERT INTO users(user_name, user_emailid, password) VALUES($1, $2, $3) RETURNING user_id, user_name, user_emailid",
            [name, email, encryptedPassword]
        );

        request.login(createdUser, (err) => {
            if (err) return handleRequestError(response, "User created but auto-login failed", err, 201);
            return response.status(201).json({ ok: true, message: "User created and logged in", user: createdUser });
        });

    } catch (error) {
        return handleRequestError(response, "Registration failed", error);
    }
});

// Local login
authRouter.post("/login", (request, response, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return handleRequestError(response, "Internal server error", err);
        if (!user) return response.status(401).json({ ok: false, message: info?.message || "Authentication failed" });

        request.logIn(user, (err) => {
            if (err) return handleRequestError(response, "Login failed", err);
            return response.status(200).json({ ok: true, user });
        });
    })(request, response, next);
});

// Logout
authRouter.post("/logout", (request, response) => {
    request.logout((err) => {
        if (err) return handleRequestError(response, "Logout failed", err);
        response.json({ ok: true, message: "Logged out successfully" });
    });
});

// Google OAuth Routes
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (request, response) => response.redirect("http://localhost:3000/auth/google/callback")
);

module.exports = authRouter;
