import dotenv from 'dotenv';

// IMPORTANTE: configurar las variables de entorno al inicio de la aplicacion antes de usarlas en cualquier otro archivo importado
dotenv.config();

import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import protectedRoutes from './routes/protectedRoutes';

const app = express();

// configuracion de la vista opcional en archivo .ejs
app.set('view engine', 'ejs');

// middleware para tratar el contenido de las peticiones en formato json
app.use(express.json());

// parser para las cookies (jwt)
app.use(cookieParser());

// renderizado opcional de un front para interactuar con el servidor usando un archivo .ejs
app.get('/', (req: Request, res: Response) => {
	res.render('../src/views/index');
});

// renderizado opcional de un front para interactuar con el servidor usando un archivo .ejs (carpeta views)
app.use('/protected', protectedRoutes);

// Authentication route
app.use('/auth', authRoutes);

// User route
app.use('/users', userRoutes);

console.log('Ejecutando...');
export default app;
