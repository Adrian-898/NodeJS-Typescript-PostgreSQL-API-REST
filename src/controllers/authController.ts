import { Request, Response } from 'express';
import { hashPassword } from '../services/password';
import { generateToken } from '../services/auth';
import prisma from '../models/user';

const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		if (!password) throw new Error('La contraseña es requerida');
		if (!email) throw new Error('El e-mail es requerido');

		const hashedPassword = await hashPassword(password);

		const user = await prisma.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		const token = generateToken(user);
		res.status(201).json({ token });
	} catch (error) {
		console.log(error);

		if (!email) {
			res.status(400).json({
				message: error,
			});
		}
		if (!password) {
			res.status(400).json({
				message: error,
			});
		}

		res.status(500).json({ error: 'Error en el registro' });
	}
};

export { register };
