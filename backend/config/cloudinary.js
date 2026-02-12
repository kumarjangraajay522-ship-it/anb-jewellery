import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'; // This line loads the .env file

// Debugging: Check if keys are loaded (Don't show this to others)
console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY); 
// If these print "undefined" in your terminal, your .env file is not being read.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Must match .env name exactly
});

export default cloudinary;