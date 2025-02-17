import { Request } from 'express';
import { JwtPayload } from './jwt.interface';

interface AuthRequest extends Request {
	user?: JwtPayload;
}

export default AuthRequest;
