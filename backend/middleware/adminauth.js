import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // CHECK: Does the token match the Admin Email + Password from .env?
        // Note: We are NOT checking the database here.
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;