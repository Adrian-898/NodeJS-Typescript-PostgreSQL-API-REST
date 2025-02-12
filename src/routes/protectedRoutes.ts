import express from 'express';
import authenticateToken from '../middlewares/authenticateToken';
import { logout } from '../controllers/protectedController';

const router = express.Router();

router.get('/', authenticateToken, logout);

export default router;
