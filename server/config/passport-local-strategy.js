const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const db = require("../config/db.js");

// authentication using passport
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async function (email, password, done) {
            // find user and establish identity
            try {
                // Fetch user from database
                const user = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [email]
                );

                if (!user) {
                    return done(null, false, { message: "Incorrect email." });
                }

                // Compare hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, {
                        message: "Incorrect password.",
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// serializing the user to decide which key is to be kept in cookies
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE user_id = $1",
            [id]
        );
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
    // check if user is logged in, then pass on the request to next function (controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect("/login");
};

module.exports = passport;