const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

router.post("/", async (req, res) => {
    const { pageNum } = req.body;

    // Validate and parse pageNum
    if (!pageNum || isNaN(pageNum)) {
        return res.status(400).json({
            ok: false,
            message: "Invalid page number provided",
        });
    }

    const page = Math.max(1, parseInt(pageNum));
    const offset = (page - 1) * 6;

    try {
        // Get total count
        const countResult = await db.one(
            "SELECT COUNT(*) as total FROM doctors"
        );
        const total = parseInt(countResult.total) || 0;

        // Get paginated results
        const result = await db.any(
            "SELECT id, name, specialty, experience, rating, profile_pic FROM doctors ORDER BY rating DESC LIMIT 6 OFFSET $1",
            [offset]
        );

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total: total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while fetching doctors",
        });
    }
});

module.exports = router;