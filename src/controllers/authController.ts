import { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../services/password';
import { generateToken, generateRefreshToken } from '../services/auth';
import prisma from '../models/user';

// crear usuario [POST]
const register = async (req: Request, res: Response): Promise<void> => {
	const { email, password, password2 } = req.body;

	// Validaciones
	if (!email || !password || !password2) {
		res.status(400).json({
			error: 'Debe llenar todos los campos',
		});
		return;
	}

	// validaciones
	if (password !== password2) {
		res.status(400).json({
			error: 'Las contraseñas deben coincidir',
		});
		return;
	}

	try {
		// encriptando contraseña
		const hashedPassword = await hashPassword(password);

		// creando usuario con los datos validados
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		console.log('usuario antes de generar token de registro: ', user.id, user.email);

		// genera tokens (inicia sesion)
		const token = await generateToken(user);
		const refreshToken = await generateRefreshToken(user);

		console.log('Registro exitoso: ', token);

		// Se responde a la peticion
		res.status(201)
			// se envia en una cookie el token
			.cookie('access_token', token, {
				httpOnly: true, // solo accesible por el servidor
				sameSite: 'strict', // solo accesible desde el mismo dominio
				secure: process.env.NODE_ENV === 'production', // solo usada a traves de https en produccion
				maxAge: 1000 * 60 * 60, // 1 hora
			})
			// se envia en una cookie el token de refresco (sin tiempo de expiracion en la cookie, el tiempo se maneja con el token, dura mas)
			.cookie('refresh_token', refreshToken, {
				httpOnly: true, // solo accesible por el servidor
				sameSite: 'strict', // solo accesible desde el mismo dominio
				secure: process.env.NODE_ENV === 'production', // solo usada a traves de https en produccion
			})
			.json({ message: 'Registro exitoso' });
	} catch (error: any) {
		console.error(error);

		// el email debe ser unico
		if (error.code === 'P2002' && error.meta.target.includes('email')) {
			res.status(400).json({ error: 'Este e-mail ya está en uso' });
			console.log('error: este email ya existe: ', error);
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
	if (!email || !password) {
		res.status(400).json({
			error: 'Debe llenar todos los campos',
		});
		return;
	}

	try {
		// validando si existe el usuario
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
		}

		// genera tokens (inicia sesion)
		const token = await generateToken(user);
		const refreshToken = await generateRefreshToken(user);

		// Se responde a la peticion
		res.status(201)
			// se envia en una cookie el token de acceso (el tiempo de expiracion se asigna al token, NO a la cookie)
			.cookie('access_token', token, {
				httpOnly: true, // solo accesible por el servidor
				sameSite: 'strict', // solo accesible desde el mismo dominio
				secure: process.env.NODE_ENV === 'production', // solo usada a traves de https en produccion
			})
			// se envia en una cookie el token de refresco (sin tiempo de expiracion en la cookie, el tiempo se maneja con el token, dura mas)
			.cookie('refresh_token', refreshToken, {
				httpOnly: true, // solo accesible por el servidor
				sameSite: 'strict', // solo accesible desde el mismo dominio
				secure: process.env.NODE_ENV === 'production', // solo usada a traves de https en produccion
			})
			.json({ message: 'Inicio de sesión exitoso' });
	} catch (error) {
		console.log(error);

		// error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, por favor intente más tarde...' });
	}
};

export { register, login };
