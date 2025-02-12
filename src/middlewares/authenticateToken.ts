import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET;

//Middleware para verificar autenticacion del usuario
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	console.log('jwtSecret before auth: ', JWT_SECRET);

	// Validando que existe la palabra secreta
	if (!JWT_SECRET) {
		res.status(500).json({ error: 'No existe palabra secreta, intente de nuevo más tarde...' });
		return;
	}

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		res.status(401).json({ error: 'No autorizado' });
		return;
	}

	console.log('before verify token: ', token);

	jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (error, decoded) => {
		if (error) {
			console.error('Error de autenticación: ', error);
			res.status(403).json({ error: 'No tienes acceso a este recurso' });
			return;
		}

		next();
	});
};

export default authenticateToken;
