require('dotenv').config();

const express = require("express");
const passport = require("passport");
const passport_google = require("./config/passport-google-oauth.js");
const passport_local = require("./config/passport-local-strategy.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from Next.js
        credentials: true, // Allow cookies/sessions
        methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
        allowedHeaders: "Content-Type,Authorization", // Allow specific headers
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    require("express-session")({
        secret: "medcare-app-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Hello world");
});

const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

app.listen(port, (err) => {
    if (err) console.log("Error:", err);

    console.log("Server is running on port:", port);
});