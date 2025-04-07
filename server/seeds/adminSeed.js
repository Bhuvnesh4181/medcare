const db = require("../config/db");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.error("Missing required environment variables: ADMIN_EMAIL or ADMIN_PASSWORD");
            return;
        }

        // Check if admin user exists
        const adminExists = await db.oneOrNone(
            "SELECT user_id FROM users WHERE user_emailid = $1",
            [ADMIN_EMAIL]
        );

        if (adminExists) {
            console.log("Admin user already exists.");
            return;
        }

        // Hash password and create admin
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await db.none(
            "INSERT INTO users (user_name, user_emailid, password) VALUES ($1, $2, $3)",
            ["Admin", ADMIN_EMAIL, hashedPassword]
        );

        console.log(" Admin user created successfully.");
    } catch (error) {
        console.error(" Error seeding admin:", error.message);
    }
};

module.exports = seedAdmin;
