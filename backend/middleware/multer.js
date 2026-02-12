import multer from "multer";

// Configure how files are stored temporarily before uploading to Cloudinary
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;