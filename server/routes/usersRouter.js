const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        data: "Users data received",
    });
});

module.exports = router;
