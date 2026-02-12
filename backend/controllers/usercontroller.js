// backend/controllers/userController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// Helper to create User Token (For Customers)
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = createToken(newUser.id);

        res.json({ 
            success: true, 
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                // Ensure these fields exist in your User Model, otherwise they might be null
                phone: newUser.phone || "",
                address: newUser.address || ""
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.json({ 
                success: true, 
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || ""
                }
            });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body; // Comes from auth middleware

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || ""
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phone, address } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();

        res.json({ 
            success: true, 
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin Login (FIXED for "Not Authorized" issue)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // CRITICAL: We sign the token with "Email + Password" string
            // This matches what adminAuth expects
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile };