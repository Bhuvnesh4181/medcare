const db = require('../../config/db');
const { cloudinary } = require('../../config/cloudinary');

const uploadImage = async (uploadedFile) => {
    if (!uploadedFile) throw new Error('No file received for processing');

    const encodedImage = Buffer.from(uploadedFile.buffer).toString('base64');
    const imageDataURI = `data:${uploadedFile.mimetype};base64,${encodedImage}`;
    
    try {
        const cloudResponse = await cloudinary.uploader.upload(imageDataURI);
        return cloudResponse.url;
    } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        throw new Error('Image upload to Cloudinary failed');
    }    
};

exports.addDoctor = async (req, res) => {
    try {
        const { name, specialty, experience, location, rating = 0, gender } = req.body;

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const imageUrl = await uploadImage(req.file);
        const doctor = await db.one(
            `INSERT INTO doctors (name, specialty, experience, location, rating, gender, profile_pic)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, specialty, experience, location, rating, gender, imageUrl]
        );

        res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ message: "Error adding doctor", error: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const doctorId = parseInt(req.params.id);
        await db.none('DELETE FROM doctors WHERE id = $1', [doctorId]);
        res.json({ message: 'Doctor removed successfully' });
    } catch (deleteDoctorError) {
        res.status(500).json({ message: 'Error removing doctor', error: deleteDoctorError.message });
    }    
};


exports.getAllDoctorsAdmin = async (req, res) => {
    try {
        const doctorList= await db.any(`
            SELECT 
                id AS doctor_id,
                name AS doctor_name,
                specialty,
                experience,
                rating,
                location,
                profile_pic AS doctor_photo
            FROM doctors 
            ORDER BY name`
        );

        res.json({ ok: true, data: { rows: doctorList } });
} catch (fetchDoctorsError) {
    console.error("Error retrieving doctor records:", fetchDoctorsError.message);
    res.status(500).json({ success: false, message: "Unable to retrieve doctors", error: fetchDoctorsError.message });
}
};