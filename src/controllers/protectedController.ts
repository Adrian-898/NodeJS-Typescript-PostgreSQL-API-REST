import { Request, Response } from 'express';

// cerrar sesion (ya el token esta verificado en el middleware)
const logout = async (req: Request, res: Response): Promise<void> => {
	res.clearCookie('access_token').clearCookie('refresh_token').redirect('/');
};

export { logout };
