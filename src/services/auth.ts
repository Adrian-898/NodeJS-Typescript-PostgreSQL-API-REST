import { User } from '../models/user.interface';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (user: User): Promise<string | void> => {
	if (!JWT_SECRET) return;

	const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '7d',
	});

	console.log('just signed token: ', token);
	return token;
};

export { generateToken };
