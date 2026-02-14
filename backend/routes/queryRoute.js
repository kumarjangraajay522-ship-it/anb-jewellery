import express from 'express'
import { addQuery, listQueries } from '../controllers/queryController.js'
import adminAuth from '../middleware/adminAuth.js' // Assuming you have admin auth middleware

const queryRouter = express.Router();

queryRouter.post('/add', addQuery); // Public route for users
queryRouter.get('/list', adminAuth, listQueries); // Protected route for admin

export default queryRouter;