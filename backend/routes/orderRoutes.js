import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// User Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, userOrders);

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;