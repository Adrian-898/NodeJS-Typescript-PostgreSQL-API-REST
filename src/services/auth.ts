import { User } from '../models/user.interface';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default';

const generateToken = (user: User): string => {
	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });

	console.log('just signed token: ', token);
	return token;
};

export { generateToken };
