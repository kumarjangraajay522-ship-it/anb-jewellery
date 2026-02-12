import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Please Login Again.' });
        }

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // FIX: Use Sequelize syntax (findByPk) instead of MongoDB (findById)
        const user = await userModel.findByPk(token_decode.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Attach user ID to the request body so controllers can use it
        req.body.userId = token_decode.id;
        
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// IMPORTANT: This 'default' export matches your 'import authUser from ...' statement
export default authUser;