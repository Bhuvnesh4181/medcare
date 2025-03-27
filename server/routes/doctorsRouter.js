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
        const query =
        "SELECT id, name, specialty, experience, rating, profile_pic FROM doctors ORDER BY rating DESC LIMIT 6 OFFSET $1";
    const result = await db.any(query, [offset]);

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

router.get("/filter", async (req, res) => {
    const { rating, experience, gender } = req.query;

    try {
        // Start building the query
        let conditions = [];
        let queryParams = [];
        let paramCounter = 1;

        // Add filters based on provided parameters
        if (rating) {
            // Rating is double precision in the database
            conditions.push(`rating <= $${paramCounter}`);
            queryParams.push(parseFloat(rating));
            paramCounter++;
        }

        if (experience) {
            // Experience is integer in the database
            conditions.push(`experience >= $${paramCounter}`);
            queryParams.push(parseInt(experience));
            paramCounter++;
        }

        if (gender) {
            // Gender is text in the database
            conditions.push(`gender = $${paramCounter}`);
            queryParams.push(gender);
            paramCounter++;
        }

        // Build the WHERE clause
        const whereClause =
            conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

        // Build complete queries
        const baseQuery = `SELECT id, name, specialty, experience, rating, profile_pic 
                           FROM doctors${whereClause} 
                           ORDER BY rating DESC`;

        const countQuery = `SELECT COUNT(*) as total 
                            FROM doctors${whereClause}`;

        console.log("Query:", baseQuery);
        console.log("Params:", queryParams);

        // Get total count with applied filters
        const countResult = await db.one(countQuery, queryParams);
        const total = parseInt(countResult.total) || 0;

        // Get filtered results
        const result = await db.any(baseQuery, queryParams);

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message:
                "An error occurred while filtering doctors: " + error.message,
        });
    }
});

module.exports = router;