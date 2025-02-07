import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Authentication route
app.use('/auth', authRoutes);

// User route
// app.use('/user', userRoutes);

console.log('Ejecutando...');
export default app;
