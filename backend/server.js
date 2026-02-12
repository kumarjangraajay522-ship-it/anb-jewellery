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

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Frontend & Admin URLs
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Middlewares
app.use(express.json());
app.use(cors());

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        
        // ⚠️ FIXED: Changed 'alter: true' to 'force: true' to fix the Key Error.
        // This will delete current tables and recreate them fresh.
        await sequelize.sync({ force: true }); 
        
        console.log("✅ Database Tables Updated & Synced Successfully!");

        httpServer.listen(port, () => console.log(`Server started on PORT : ${port}`));
    } catch (error) {
        console.error("❌ Database Error:", error);
    }
};

startServer();

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter); 

app.get('/', (req, res) => res.send("API Working"));