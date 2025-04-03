const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
    addDoctor,
    deleteDoctor,
    getAllDoctorsAdmin
} = require('../../controllers/admin/doctorController');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
            return cb(new Error('Only JPEG and PNG image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Routes
router.get('/all', getAllDoctorsAdmin);
router.post('/create', upload.single('profile_pic'), addDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
