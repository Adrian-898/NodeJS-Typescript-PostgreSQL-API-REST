import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { generateToken } from '../services/auth';
import { User } from '../models/user.interface';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	if (!JWT_SECRET) {
		res.status(500).json({ error: 'Error de autenticación' });
		return;
	}

	const accessToken = req.cookies.access_token;
	if (!accessToken) {
		res.status(401).json({ error: 'Error de autenticación' });
		return;
	}

	try {
		// Verificar token
		jwt.verify(accessToken, JWT_SECRET, { algorithms: ['HS256'] }, (error) => {
			if (error) {
				throw error;
			} else {
				console.log('token de acceso verificado en authenticateToken');
				next();
			}
		});
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			console.log('token de acceso expirado');

			// Refresca el token expirado
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				console.log('No hay token de refresco');

				res.status(403).json({ error: 'Session expired, please log in again' });
				return;
			}

			try {
				console.log('verificando token de refresco');

				// Verificar token de refresco
				jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] }, (error, decoded) => {
					if (error) {
						throw error;
					} else {
						console.log('token de refresco verificado');
						const user = {
							id: (decoded as User).id,
							email: (decoded as User).email,
							password: '',
						};

						// Genera nuevo access_token usando el payload de refreshToken
						const newAccessToken = generateToken(user);

						// Envia el nuevo access_token en una cookie
						res.cookie('access_token', newAccessToken, {
							httpOnly: true,
							secure: process.env.NODE_ENV === 'production', // Use Secure in production
							sameSite: 'strict',
						});

						console.log('nuevo access token generado y enviado');
						next();
					}
				});
			} catch (refreshError) {
				console.error('Error verificando token de refresco: ', refreshError);
				res.status(403).json({ error: 'La sesión expiró, por favor vuelve a iniciar sesión...' });
				return;
			}
		} else {
			// Otros errores
			console.error('Error de autenticación: ', error);
			res.status(403).json({ error: 'Acceso denegado' });
			return;
		}
	}
};

export default authenticateToken;
