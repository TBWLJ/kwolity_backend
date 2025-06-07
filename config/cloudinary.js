const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if connection is successful
cloudinary.api.ping()
    .then(res => {
        console.log('Cloudinary connected successfully:', res);
    })
    .catch(err => {
        console.error('Cloudinary connection failed:', err.message);
    });

module.exports = cloudinary;