import express from 'express';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController';
import authenticateToken from '../middlewares/authenticateToken';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
