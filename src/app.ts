import dotenv from 'dotenv';

// IMPORTANTE: configurar las variables de entorno al inicio de la aplicacion antes de usarlas en cualquier otro archivo importado
dotenv.config();

import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// middleware para tratar el contenido de las peticiones en formato json
app.use(express.json());

// Authentication route
app.use('/auth', authRoutes);

// User route
app.use('/users', userRoutes);

console.log('Ejecutando...');
export default app;
