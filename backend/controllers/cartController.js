import userModel from '../models/userModel.js';

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        // Fetch user data
        const userData = await userModel.findByPk(userId);
        let cartData = userData.cartData || {}; // Handle null/empty cart

        // Update quantity
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        // Save back to database
        await userModel.update({ cartData }, { where: { id: userId } });
        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update user cart quantity
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        
        const userData = await userModel.findByPk(userId);
        let cartData = userData.cartData || {};

        cartData[itemId] = quantity;

        await userModel.update({ cartData }, { where: { id: userId } });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const userData = await userModel.findByPk(userId);
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart };