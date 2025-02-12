import dotenv from 'dotenv';

// IMPORTANTE: configurar las variables de entorno al inicio de la aplicacion antes de usarlas en cualquier otro archivo importado
dotenv.config();

import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// configuracion de la vista opcional en archivo .ejs
app.set('view engine', 'ejs');

// middleware para tratar el contenido de las peticiones en formato json
app.use(express.json());

// parser para las cookies (jwt)
app.use(cookieParser());

// renderizado opcional de un front para interactuar con el servidor usando un archivo .ejs
app.get('/', (req: Request, res: Response) => {
	res.render('index');
});

// renderizado opcional de un front para interactuar con el servidor usando un archivo .ejs
app.get('/protected', (req: Request, res: Response) => {
	const JWT_SECRET = process.env.JWT_SECRET;
	const token = req.cookies.access_token;

	if (!token) {
		res.status(403).json({ message: 'Acceso no autorizado' });
		return;
	}

	if (!JWT_SECRET) {
		console.error('No hay palabra secreta para verificar el token');
		res.status(500).json({ error: 'Ha ocurrido un error, intenta más tarde...' });
		return;
	}

	try {
		const data = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

		res.render('protected', { data });
	} catch (error) {
		console.error('Error de autenticación: ', error);
		res.status(401).json({ error: 'No tienes acceso a este recurso' });
	}
});

// Authentication route
app.use('/auth', authRoutes);

// User route
app.use('/users', userRoutes);

console.log('Ejecutando...');
export default app;
