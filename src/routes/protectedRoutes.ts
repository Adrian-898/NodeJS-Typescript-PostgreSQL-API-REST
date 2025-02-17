import express, { Request, Response } from 'express';
import { logout } from '../controllers/protectedController';
import authenticateToken from '../middlewares/authenticateToken';

const router = express.Router();

router.get('/', authenticateToken, (req: Request, res: Response) => {
	res.render('protected', { user: req.user });
});

router.get('/logout', logout);

export default router;
