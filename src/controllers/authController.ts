import crypto from 'node:crypto';
import { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../services/password';
import { generateToken } from '../services/auth';
import prisma from '../models/user';

// crear usuario [POST]
const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	// Validaciones
	if (!email || !password) {
		res.status(400).json({
			error: 'Debe llenar todos los campos',
		});
		return;
	}

	try {
		// El email ya existe
		let exists = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		// El email ya existe
		if (exists) {
			res.status(400).json({ error: 'Este e-mail ya está en uso' });
			return;
		}

		// encriptando contraseña
		const hashedPassword = await hashPassword(password);

		// Generando ID
		// const id: string = crypto.randomUUID();

		// creando usuario con los datos validados
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		// genera token
		const token = generateToken(user);

		// response
		res.status(201).json({ 'Token: ': token, 'Email: ': email });
	} catch (error: any) {
		console.log(error);

		// el email debe ser unico
		if (error.code === 'P2002' && error.meta.target.includes('email')) {
			res.status(400).json({ error: 'Este e-mail ya está en uso' });
			return;
		}

		// error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, por favor intente más tarde...' });
	}
};

// iniciar sesion [POST]
const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	// Validaciones
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

	try {
		// comprobando si existe el usuario
		const user = await prisma.user.findUnique({ where: { email } });

		// si no existe el usuario
		if (!user) {
			res.status(404).json({ error: 'El usuario o la contraseña son incorrectos' });
			return;
		}

		// verifica que la contraseña coincida
		const passwordMatch = await comparePasswords(password, user.password);

		// si la contraseña no coincide
		if (!passwordMatch) {
			res.status(401).json({
				error: 'El usuario o la contraseña son incorrectos',
			});
			return;
		} else {
			// si coincide se genera un token y se responde a la peticion
			const token = generateToken(user);
			res.status(200).json({ token });
		}
	} catch (error) {
		console.log(error);

		// error desconocido
		res.status(500).json({ error: 'Ocurrió un error, intente más tarde...' });
	}
};

// cerrar sesion
const logout = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
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
		res.status(500).json({ error: 'Ocurrió un error, intente más tarde...' });
	}
};

export { register, login, logout };
