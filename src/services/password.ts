import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

// Crear contraseña hasheada
const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, SALT_ROUNDS);
};

export { hashPassword };

// Comparar con el hash de la base de datos
