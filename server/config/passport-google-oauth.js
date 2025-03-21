const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
// const User = require('../models/user');
const env = require("./environment");

let opts = {
    clientID: env.google_client_id,
    clientSecret: env.google_client_Secret,
    callbackURL: env.google_callback_URL,
};

passport.use(
    new googleStrategy(opts, (accessToken, refreshToken, profile, done) => {
        // emails is array of emails of user on google and value is the actual email id
        // User.findOne({email: profile.emails[0].value}).exec((err, user) => {
        //     if(err){
        //         console.log("Error in Google OAuth....", err);
        //         return done(err, false);
        //     }
        //     if(user){
        //         // if found set this user as req.user
        //         return done(null, user);
        //     }else{
        //         // if not found, create this user and set as req.user
        //         User.create({
        //             name: profile.displayName,
        //             email: profile.emails[0].value,
        //             password: crypto.randomBytes(20).toString('hex')
        //         },
        //         (err, user) => {
        //             if(err){
        //                 console.log("Error in creating user in Google OAuth....", err);
        //                 return done(err, false);
        //             }
        //             return done(null, user);
        //         });
        //     }
        // });
    })
);

module.exports = passport;
