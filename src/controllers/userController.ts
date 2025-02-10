import { Request, Response } from 'express';
import { hashPassword } from '../services/password';
import prisma from '../models/user';

// crear usuario [POST]
const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email) {
			res.status(400).json({
				error: 'El e-mail es requerido',
			});
			return;
		}
		if (!password) {
			res.status(400).json({
				error: 'La contraseña es requerida',
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

		res.status(201).json(user);
	} catch (error: any) {
		console.log(error);

		if (error.code === 'P2002' && error.meta.target.includes('email')) {
			res.status(400).json({ error: 'Este e-mail ya está en uso' });
			return;
		}

		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

//get all [GET]
const getUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		const users = await prisma.user.findMany();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

// get unico [GET]
const getUserById = async (req: Request, res: Response): Promise<void> => {
	const userId = parseInt(req.params.id);

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

// actualizar un usuario [PUT]
const updateUser = async (req: Request, res: Response): Promise<void> => {
	const userId = parseInt(req.params.id);
	const { email, password } = req.body;
	let hashedPassword: string | null = null;

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		if (password) {
			hashedPassword = await hashPassword(password);
		}

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				email: email || user.email,
				password: hashedPassword || user.password,
			},
		});

		res.status(200).json(user);
	} catch (error: any) {
		if (error.code === 'P2002' && error.meta.target.includes(['email'])) {
			res.status(400).json({ error: 'El email ingresado ya existe' });
		} else {
			res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
		}
	}
};

// borrar un usuario [DELETE]
const deleteUser = async (req: Request, res: Response): Promise<void> => {
	const userId = parseInt(req.params.id);

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		await prisma.user.delete({
			where: {
				id: userId,
			},
		});

		res.status(200)
			.json({ message: `El usuario ${user.email} ha sido eliminado` })
			.end();
	} catch (error) {
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
