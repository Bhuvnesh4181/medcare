const express = require("express");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

app.listen(port, (err) => {
    if (err) console.log("Error:", err);

    console.log("Server is running on port:", port);
});
