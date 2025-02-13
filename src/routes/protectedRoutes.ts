import express from 'express';
import jwt from 'jsonwebtoken';
import { logout } from '../controllers/protectedController';

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.get('/', (req, res) => {
	const token = req.cookies.access_token;
	try {
		if (!JWT_SECRET) throw new Error('No existe palabra secreta para generar el token...');
		if (!token) throw new Error('No existe el token...');

		const user = jwt.verify(token, JWT_SECRET);

		res.render('protected', { user });
	} catch (error) {
		console.error(error);
		res.status(500).send('<h1>No tienes permisos para acceder a este recurso...<h1>');
	}
});
router.get('/logout', logout);

export default router;
