const db = require('../../config/db');
const multer = require('multer');
const {cloudinary} = require('../../config/cloudinary');


exports.addDoctor = async (req, res) => {
    try {
        const { name, specialty, experience, location, rating, gender } = req.body;

        // Ensure file is available in req.file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const imageUrl = await uploadImage(req.file);

        const ratings = rating || 0;
        const doctor = await db.one(
            `INSERT INTO doctors 
                (name, specialty, experience, location, rating, gender, profile_pic)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                name,
                specialty,
                experience,
                location,
                ratings,
                gender,
                imageUrl,  // Use imageUrl here
            ]
        );
        res.status(201).json({
            message: "Doctor added successfully",
            doctor,
        });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({
            message: "Error adding doctor",
            error: error.message,
        });
    }
};

// Function to upload image to Cloudinary
const uploadImage = async (file) => {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    const base64Image = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

    try {
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.url;  // Return the uploaded image URL
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};
exports.deleteDoctor = async (req, res) => {
    try {
        const  id  = parseInt(req.params.id);
        await db.none('DELETE FROM doctors WHERE id = $1', [id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doctor = await db.one('SELECT * FROM doctors WHERE id = $1', [id]);
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
};


exports.getAllDoctorsAdmin = async (req, res) => {
    try {
        // Fetch all doctors with correct column names
        const doctors = await db.any(`
            SELECT 
                id AS doctor_id,
                name AS doctor_name,
                specialty,
                experience,
                rating,
                location,
                profile_pic AS doctor_photo
            FROM doctors 
            ORDER BY name
        `);

        // Send response
        res.json({
            ok: true,
            data: {
                rows: doctors
            }
        });

    } catch (error) {
        console.error("Error in getAllDoctorsAdmin:", error.message);
        res.status(500).json({
            ok: false,
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
};
