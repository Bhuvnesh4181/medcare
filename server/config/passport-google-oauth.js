const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db.js");

// Debug: Log environment variables


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [profile.emails[0].value]
                );

                if (!user) {
                    // Create new user if doesn't exist
                    const query = `
                        INSERT INTO users(user_name, user_emailid, password)
                        VALUES($1, $2, $3)
                        RETURNING user_name, user_emailid, user_id;
                    `;

                    const result = await db.query(query, [
                        profile.displayName,
                        profile.emails[0].value,
                        'google-oauth' // placeholder password for Google users
                    ]);

                    user = result[0];
                }

                return done(null, user);
            } catch (err) {
                console.error("Google OAuth Error:", err);
                return done(err, null);
            }
        }
    )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE user_id = $1",
            [id]
        );
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;