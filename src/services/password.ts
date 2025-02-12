import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : undefined;

// Crear contraseña hasheada
const hashPassword = async (password: string): Promise<string> => {
	try {
		if (!SALT_ROUNDS || isNaN(SALT_ROUNDS))
			throw new Error('Incorrect or missing SALT needed to encrypt password...');
		return await bcrypt.hash(password, SALT_ROUNDS);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

// Comparar contraseñas para iniciar sesion
const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePasswords };
