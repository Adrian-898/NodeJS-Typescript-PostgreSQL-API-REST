import { Request, Response } from 'express';
import prisma from '../models/user';

// cerrar sesion (ya el token esta verificado en el middleware)
const logout = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	try {
	} catch (error) {}
};

export { logout };
