import express from 'express';
import jwt from 'jsonwebtoken';
import { logout } from '../controllers/protectedController';
import authenticateToken from '../middlewares/authenticateToken';

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
	const token = req.cookies.access_token;
	try {
		if (!JWT_SECRET) {
			res.status(403).send('<h1>No tienes permisos para acceder a este recurso...<h1>');
			return;
		}
		if (!token) {
			res.status(403).send('<h1>No tienes permisos para acceder a este recurso...<h1>');
			return;
		}

		// Verificar token
		jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (error, user) => {
			if (error) {
				res.status(403).send('<h1>No tienes permisos para acceder a este recurso...<h1>');
				return;
			} else {
				console.log('token de acceso verificado en /protected');

				res.render('protected', { user });
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Ha ocurrido un error...' });
	}
});
router.get('/logout', logout);

export default router;
