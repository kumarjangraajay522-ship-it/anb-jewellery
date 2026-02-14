import express from 'express';
import { updateSaleConfig, getSaleConfig } from '../controllers/saleController.js';
import adminAuth from '../middleware/adminAuth.js';

const saleRouter = express.Router();

saleRouter.post('/update', adminAuth, updateSaleConfig); // Protected
saleRouter.get('/get', getSaleConfig); // Public (for user website)

export default saleRouter;