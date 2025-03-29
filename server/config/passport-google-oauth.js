

const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const db = require("./db.js");

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;

                if (!email) {
                    return done(new Error("Google profile does not have an email"), null);
                }

                // Check if user already exists
                let user = await db.oneOrNone("SELECT * FROM users WHERE user_emailid = $1", [email]);

                if (!user) {
                    // Insert new user if not found
                    const query = `
                        INSERT INTO users(user_name, user_emailid, password)
                        VALUES($1, $2, $3)
                        RETURNING user_id, user_name, user_emailid;
                    `;

                    const newUser = await db.one(query, [name, email, "google-oauth"]);
                    user = newUser;
                }

                return done(null, user);
            } catch (error) {
                console.error("🔥 Google OAuth Error:", error);
                return done(error, null);
            }
        }
    )
);

// Serialize user (store user_id in session)
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user (retrieve user from database)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone("SELECT * FROM users WHERE user_id = $1", [id]);
        done(null, user);
    } catch (error) {
        console.error("🔥 Error in deserializing user:", error);
        done(error, null);
    }
});

module.exports = passport;
