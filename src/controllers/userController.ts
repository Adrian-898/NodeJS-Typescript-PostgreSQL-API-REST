import { Response } from 'express';
import { hashPassword } from '../services/password';
import prisma from '../models/user';
import AuthRequest from '../models/AuthRequest.interface';

//get all [GET]
const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		//busca todos los usuarios
		const users = await prisma.user.findMany();

		// responde a la peticion con los usuarios
		res.status(200).json(users);
	} catch (error) {
		// error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

// get unico [GET]
const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
	const userId = req.params.id;

	try {
		// Valida que exista el usuario
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		// si el usuario no existe
		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		// Se envia la respuesta a la peticion con el usuario encontrado
		res.status(200).json(user);
	} catch (error) {
		// Error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

// actualizar un usuario [PUT]
const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
	const { email, password } = req.body;

	// Validando que se proporciona al menos un campo a editar
	if (!email && !password) {
		res.status(400).json({
			error: 'Debe proporcionar al menos un campo para cambiar',
		});
		return;
	}

	const userId = req.params.id;
	let hashedPassword: string | undefined = undefined;

	try {
		// Validando que el usuario existe
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		// si no existe el usuario
		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		// encriptando nueva contraseña
		if (password) {
			hashedPassword = await hashPassword(password);
		}

		// se declaran los datos a editar
		let data = {
			email: email || user.email,
			password: hashedPassword || user.password,
		};

		// se edita el usuario con los datos nuevos
		const newUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data,
		});

		// se envia el response con el nuevo usuario
		res.status(200).json(newUser);
	} catch (error: any) {
		// Error capturado por prisma, en caso de que se ingrese un email existente (El email debe ser unico)
		if (error.code === 'P2002' && error.meta.target.includes(['email'])) {
			res.status(400).json({ error: 'El email ingresado ya existe' });
		}

		// Error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

// borrar un usuario [DELETE]
const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
	const userId = req.params.id;

	try {
		// Validando que existe el usuario
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		// si no existe el usuario
		if (!user) {
			res.status(404).json({ error: 'Error, no se ha encontrado este usuario' });
			return;
		}

		// se borra el usuario
		await prisma.user.delete({
			where: {
				id: userId,
			},
		});

		// se responde a la peticion
		res.status(200)
			.json({ message: `El usuario ${user.email} ha sido eliminado` })
			.end();
	} catch (error) {
		// Error desconocido
		res.status(500).json({ error: 'Ha ocurrido un error, intente más tarde...' });
	}
};

export { getUsers, getUserById, updateUser, deleteUser };
