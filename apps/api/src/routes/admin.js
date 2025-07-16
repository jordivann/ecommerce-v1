// src/routes/admin.js
import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/dashboard', authRequired('admin'), (req, res) => {
  res.json({ message: `Bienvenido al panel admin, ${req.user.id}` });
});

export default router;
