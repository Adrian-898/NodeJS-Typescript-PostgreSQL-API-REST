import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { generateToken } from '../services/auth';
import { JwtPayload } from '../models/jwt.interface';
import { User } from '../models/user.interface';
import AuthRequest from '../models/AuthRequest.interface';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
	if (!JWT_SECRET) {
		res.status(500).json({ error: 'Error de autenticación' });
		return;
	}

	let accessToken = req.cookies.access_token;
	if (!accessToken) {
		res.status(401).json({ error: 'Error de autenticación' });
		return;
	}

	try {
		// Verificar token
		jwt.verify(accessToken, JWT_SECRET, { algorithms: ['HS256'] }, (error, user) => {
			if (error) {
				throw error;
			} else {
				console.log('token de acceso verificado en authenticateToken');
				req.user = user as JwtPayload;
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

			console.log('verificando token de refresco');

			// Verificar token de refresco
			jwt.verify(refreshToken, JWT_SECRET, { algorithms: ['HS256'] }, async (error, user) => {
				if (error instanceof jwt.TokenExpiredError) {
					console.error('Token de refresco expirado, redireccionando a login... ');
					res.redirect('/protected/logout');
					return;
				} else {
					console.log('token de refresco verificado');

					console.log('user before generateToken(user as User): ', user);

					// Genera nuevo access_token usando el payload de refreshToken
					const newAccessToken = await generateToken(user as User);

					console.log('newAccessToken: ', newAccessToken);

					// Envia el nuevo access_token en una cookie
					res.cookie('access_token', newAccessToken, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict',
					});

					req.user = user as JwtPayload;

					console.log('nuevo access token generado y enviado');
					next();
				}
			});
		} else {
			// Otros errores
			console.error('Error de autenticación: ', error);
			res.status(403).send('<h1>Ocurrió un error, por favor vuelve a iniciar sesión...<h1>');
			return;
		}
	}
};

export default authenticateToken;
