import { JwtPayload } from '../models/jwt.interface';

// agrega la propiedad user como interfaz JwtPayload a Request en express, esto para enviar datos del usuario por el request...
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
