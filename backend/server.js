import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/sqlDB.js'; 
import sequelize from './config/sqlDB.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import cartRouter from './routes/cartRoutes.js'; 
import queryRouter from './routes/queryRoute.js'
import saleRouter from './routes/saleRoute.js';

const app = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);

// --- 1. SUPER PERMISSIVE CORS (The Fix) ---
// 'origin: true' tells the server to accept requests from ANYWHERE.
// This is the strongest fix for development issues.
app.use(cors({
    origin: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token", "Authorization"], 
    credentials: true
}));

app.use(express.json());

// --- 2. SOCKET.IO SETUP ---
const io = new Server(httpServer, {
    cors: { origin: true, methods: ["GET", "POST"] }
});
app.set('io', io);

// --- 3. START SERVER (Robust) ---
const startServer = async () => {
    try {
        // Try connecting to DB
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log("✅ Database Connected & Synced!");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        // We continue starting the server so you can see the error in the browser
    }

    // Start listening even if DB fails, so we don't get 'Network Error'
    httpServer.listen(port, () => {
        console.log(`\n=============================================`);
        console.log(`🚀 SERVER RUNNING ON: http://localhost:${port}`);
        console.log(`=============================================\n`);
    });
};

startServer();

// --- 4. ROUTES ---
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter); 
app.use('/api/contact', queryRouter);
app.use('/api/sale', saleRouter);

app.get('/', (req, res) => res.send("API Working"));