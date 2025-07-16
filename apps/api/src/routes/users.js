import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js'; 
import { pool } from '../db.js';

const router = Router();

// GET /api/v1/profile
router.get('/profile', authRequired, async (req, res) => {
  try {
    const { id } = req.user;
    const { rows } = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
