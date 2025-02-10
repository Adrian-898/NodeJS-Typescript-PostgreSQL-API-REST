import { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../services/password';
import { generateToken } from '../services/auth';
import prisma from '../models/user';

const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		if (!email) {
			res.status(400).json({
				message: 'El e-mail es requerido',
			});
			return;
		}
		if (!password) {
			res.status(400).json({
				message: 'La contraseña es requerida',
			});
			return;
		}

		const hashedPassword = await hashPassword(password);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		const token = generateToken(user);
		res.status(201).json({ token });
	} catch (error: any) {
		console.log(error);

		if (error.code === 'P2002' && error.meta.target.includes('email')) {
			res.status(400).json({ message: 'Este e-mail ya está en uso' });
		}
	}
};

const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
		if (!email) {
			res.status(400).json({
				message: 'El e-mail es requerido',
			});
			return;
		}
		if (!password) {
			res.status(400).json({
				message: 'La contraseña es requerida',
			});
			return;
		}

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			res.status(404).json({ error: 'El usuario o la contraseña son incorrectos' });
			return;
		}

		const passwordMatch = await comparePasswords(password, user.password);
		if (!passwordMatch) {
			res.status(401).json({
				error: 'El usuario o la contraseña son incorrectos',
			});
			return;
		} else {
			const token = generateToken(user);
			res.status(200).json({ token });
		}
	} catch (error) {
		console.log(error);
	}
};

export { register, login };
