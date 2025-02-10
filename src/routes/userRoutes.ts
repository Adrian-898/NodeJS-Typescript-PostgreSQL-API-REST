import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default';

//Middleware para verificar autenticacion del usuario
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	console.log('jwtSecret before auth: ', JWT_SECRET);

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

router.post('/', authenticateToken, () => {
	return console.log('post');
});
router.get('/', authenticateToken, () => {
	return console.log('getAll');
});
router.get('/:id', authenticateToken, () => {
	return console.log('getById');
});
router.put('/:id', authenticateToken, () => {
	return console.log('put');
});
router.delete('/:id', authenticateToken, () => {
	return console.log('delete');
});

export default router;
