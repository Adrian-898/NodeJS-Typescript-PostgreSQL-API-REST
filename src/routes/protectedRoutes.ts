import express from 'express';
import authenticateToken from '../middlewares/authenticateToken';
import { logout } from '../controllers/protectedController';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
	res.render('../views/protected.ejs');
});
router.get('/logout', authenticateToken, logout);

export default router;
