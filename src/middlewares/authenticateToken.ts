import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { generateToken } from '../services/auth';
import { User } from '../models/user.interface';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	if (!JWT_SECRET) {
		res.status(500).json({ error: 'Server error: JWT secret missing' });
		return;
	}

	const accessToken = req.cookies.access_token;
	if (!accessToken) {
		res.status(401).json({ error: 'Authorization required' });
		return;
	}

	try {
		// Verificar token
		const decoded = jwt.verify(accessToken, JWT_SECRET, { algorithms: ['HS256'] });
		(req as any).user = decoded; // Datos del usuario agregados al request
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			// Refresca el token expirado
			const refreshToken = req.cookies.refresh_token;
			if (!refreshToken) {
				res.status(403).json({ error: 'Session expired, please log in again' });
				return;
			}

			try {
				// Verificar token de refresco
				const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);

				const user = { id: (decodedRefresh as User).id, email: (decodedRefresh as User).email, password: '' };

				// Genera nuevo access_token usando el payload de refreshToken
				const newAccessToken = generateToken(user);

				// Envia el nuevo access_token en una cookie
				res.cookie('access_token', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production', // Use Secure in production
					sameSite: 'strict',
					maxAge: 1000 * 60 * 60, // 1 hora
				});

				// Agrega los datos del usuario al request
				(req as any).user = decodedRefresh;
				next();
			} catch (refreshError) {
				console.error('Refresh token error: ', refreshError);
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
