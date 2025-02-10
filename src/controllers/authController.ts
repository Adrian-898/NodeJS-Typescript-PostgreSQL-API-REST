import { Request, Response } from 'express';
import { hashPassword } from '../services/password';
import { generateToken } from '../services/auth';
import prisma from '../models/user';

const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		if (!email) throw new Error('El e-mail es requerido');
		if (!password) throw new Error('La contraseña es requerida');

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
				message: 'El e-mail es requerido',
			});
		}
		if (!password) {
			res.status(400).json({
				message: 'La contraseña es requerida',
			});
		}
	}
};

export { register };
