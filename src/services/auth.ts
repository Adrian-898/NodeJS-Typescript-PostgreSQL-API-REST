import { User } from '../models/user.interface';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (user: User): Promise<string> => {
	try {
		if (!JWT_SECRET) throw new Error('No existe palabra secreta para generar el token...');

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			algorithm: 'HS256',
			expiresIn: '1h',
		});

		console.log('just signed token: ', token);
		return token;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export { generateToken };
