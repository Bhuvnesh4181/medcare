const express = require('express');
const router = express.Router();
const multer = require('multer');
const isAdmin = require('../../middleware/authMiddleware');
const {
    getAllDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    searchDoctors,
    getAllDoctorsAdmin
} = require('../../controllers/admin/doctorController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Public routes
router.get('/public', getAllDoctors);
router.get('/public/:id', getDoctorById);
router.get('/search', searchDoctors);

// Admin protected routes
//router.use(isAdmin);

router.get('/', getAllDoctors);
router.get('/all', getAllDoctorsAdmin);
router.post('/create', upload.single('doctor_photo'), addDoctor);
//router.put('/:id', upload.single('doctor_photo'), updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router; 