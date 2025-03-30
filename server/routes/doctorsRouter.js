const express = require("express");
const db = require("../config/db.js");

const router = express.Router();

// Helper function for error handling
const handleError = (res, message, error = null, status = 500) => {
    console.error(message, error ? error.message : "");
    return res.status(status).json({ ok: false, message });
};

// Pagination helper
const getPagination = (pageNum, limit = 6) => {
    const page = Math.max(1, parseInt(pageNum) || 1);
    return { page, offset: (page - 1) * limit, limit };
};

// Fetch paginated doctors list
router.post("/", async (req, res) => {
    const { pageNum } = req.body;
    const { offset, limit } = getPagination(pageNum);

    try {
        const countResult = await db.oneOrNone("SELECT COUNT(*) AS total FROM doctors");
        const total = countResult ? parseInt(countResult.total) : 0;

        const doctors = await db.any(
            "SELECT id, name, specialty, experience, rating, profile_pic FROM doctors ORDER BY rating DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        return res.status(200).json({ ok: true, data: { rows: doctors, total } });
    } catch (error) {
        return handleError(res, "An error occurred while fetching doctors", error);
    }
});

// Filter doctors by rating, experience, and gender
router.post("/filter", async (req, res) => {
    const { rating, experience, gender } = req.query;
    const { pageNum } = req.body;
    const { offset, limit } = getPagination(pageNum);

    try {
        let conditions = [];
        let params = [];
        
        if (rating) conditions.push(`rating <= $${params.push(parseFloat(rating))}`);
        if (experience) conditions.push(`experience >= $${params.push(parseInt(experience))}`);
        if (gender) conditions.push(`gender = $${params.push(gender)}`);

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const countResult = await db.oneOrNone(`SELECT COUNT(*) AS total FROM doctors ${whereClause}`, params);
        const total = countResult ? parseInt(countResult.total) : 0;

        params.push(limit, offset);
        const doctors = await db.any(
            `SELECT id, name, specialty, experience, rating, profile_pic 
            FROM doctors ${whereClause} 
            ORDER BY rating DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return res.status(200).json({ ok: true, data: { rows: doctors, total } });
    } catch (error) {
        return handleError(res, "An error occurred while filtering doctors", error);
    }
});

// Search doctors by name or specialty
router.get("/search", async (req, res) => {
    const { q, page } = req.query;
    const { offset, limit } = getPagination(page);

    try {
        const searchPattern = `%${q}%`;

        const countResult = await db.oneOrNone(
            "SELECT COUNT(*) AS total FROM doctors WHERE name ILIKE $1 OR specialty ILIKE $1",
            [searchPattern]
        );
        const total = countResult ? parseInt(countResult.total) : 0;

        const doctors = await db.any(
            `SELECT id, name, specialty, experience, rating, profile_pic 
            FROM doctors 
            WHERE name ILIKE $1 OR specialty ILIKE $1 
            ORDER BY rating DESC 
            LIMIT $2 OFFSET $3`,
            [searchPattern, limit, offset]
        );

        return res.status(200).json({ ok: true, data: { rows: doctors, total } });
    } catch (error) {
        return handleError(res, "An error occurred while searching doctors", error);
    }
});


router.get("/doctor/:id", async (req, res) => {
    const docId = parseInt(req.params.id);

    if (!docId) {
        return res
            .status(400)
            .json({ ok: false, message: "Missing payload values!" });
    }

    try {
        const query = `SELECT * FROM doctors WHERE id=$1`;
        const result = await db.one(query, [docId]);

        return res.json({ ok: true, doctor: result });
    } catch (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while searching doctor: " + err.message,
        });
    }
});

module.exports = router;
