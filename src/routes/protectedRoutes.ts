import express, { Response } from 'express';
import { logout } from '../controllers/protectedController';
import authenticateToken from '../middlewares/authenticateToken';
import AuthRequest from '../models/AuthRequest.interface';

const router = express.Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
	res.render('protected', req.user);
});

router.get('/logout', logout);

export default router;
