import express from 'express';
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js'; // Aapka Auth Middleware

const cartRouter = express.Router();

// Cart Routes
cartRouter.post('/get', authUser, getUserCart);
cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;