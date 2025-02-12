import bcrypt from 'bcrypt';

const SALT_ROUNDS: string | undefined = process.env.SALT_ROUNDS;

// Crear contraseña hasheada
const hashPassword = async (password: string): Promise<string | void> => {
	try {
		if (!SALT_ROUNDS) throw new Error('No SALT defined to encrypt password...');
		return await bcrypt.hash(password, SALT_ROUNDS);
	} catch (error) {
		console.error(error);
	}
};

// Comparar contraseñas para iniciar sesion
const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePasswords };
