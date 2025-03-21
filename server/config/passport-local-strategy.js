const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

// const User = require('../models/user');

// authentication using passport
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        function (req, email, password, done) {
            // find user and establish identity
            // User.findOne({email: email}, (err, user) => {
            //     if(err){
            //         // req.flash('error', err);
            //         return done(err);
            //     }
            //     if(!user || user.password != password){
            //         req.flash('error', 'Invalid Username/Password');
            //         return done(null, false);
            //     }
            //     return done(null, user);
            // });
        }
    )
);

// serializing the user to decide which key is to be kept in cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser((id, done) => {
    // User.findById(id, (err, user) => {
    //     if(err){
    //         console.log("Error in finding user ---> passport ---> deserializing");
    //         done(err, false);
    //     }
    //     return done(null, user);
    // })
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
