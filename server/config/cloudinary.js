require('dotenv').config(); // Load environment variables from .env

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
cloudinary.api.ping()
    .then(result => console.log('✅ Cloudinary connection successful:', result))
    .catch(error => console.error('❌ Cloudinary connection failed:', error));

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pic",
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
    }
});

const upload = multer({ storage: storage });

// Export both Cloudinary and Multer Upload
module.exports = { cloudinary, upload };