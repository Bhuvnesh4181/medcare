const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../config/db.js");

// Local Strategy for User Authentication
passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                // Fetch user from database
                const user = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [email]
                );

                if (!user) {
                    return done(null, false, { message: "Incorrect email." });
                }

                // Verify password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: "Incorrect password." });
                }

                return done(null, user);
            } catch (error) {
                console.error("🔥 Authentication Error:", error);
                return done(error);
            }
        }
    )
);

// Serialize user (store user_id in session)
passport.serializeUser((user, done) => done(null, user.user_id));

// Deserialize user (retrieve user from database)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone("SELECT * FROM users WHERE user_id = $1", [id]);
        done(null, user);
    } catch (error) {
        console.error("🔥 Error in deserializing user:", error);
        done(error);
    }
});

// Middleware to Check Authentication
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("https://localhost:3000/login");
};

module.exports = passport;
