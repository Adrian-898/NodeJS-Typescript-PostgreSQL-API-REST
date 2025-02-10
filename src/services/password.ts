import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

// Crear contraseña hasheada
const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, SALT_ROUNDS);
};

// Comparar contraseñas para iniciar sesion
const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePasswords };

// Comparar con el hash de la base de datos
