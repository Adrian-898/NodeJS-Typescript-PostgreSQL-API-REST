import dotenv from 'dotenv';

// IMPORTANTE: configurar las variables de entorno al inicio de la aplicacion antes de usarlas en cualquier otro archivo importado
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
/* 
// configuracion de la vista opcional en archivo .ejs
app.set('view engine', 'ejs');
 */

// middleware para tratar el contenido de las peticiones en formato json
app.use(express.json());

// parser para las cookies (jwt)
app.use(cookieParser());

/*
// renderizado opcional de un front para interactuar con el servidor usando un archivo .ejs
app.get('/', (req, res) => {
	res.render('example', { name: 'Adrian' });
});
*/

// Authentication route
app.use('/auth', authRoutes);

// User route
app.use('/users', userRoutes);

console.log('Ejecutando...');
export default app;
