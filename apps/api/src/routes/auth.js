// src/routes/auth.js
import { Router } from 'express';
import { pool } from '../db.js';
import { body, validationResult } from 'express-validator';
import { hashPassword, comparePassword, signToken } from '../lib/authHash.js';
import { authRequired } from '../middlewares/authMiddleware.js';
const router = Router();

// Registro
router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
      

    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length)
        return res.status(409).json({ error: 'El email ya está registrado' });

      const hashed = await hashPassword(password);
      const result = await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role`,
        [name, email, hashed]
      );

      const token = signToken({ id: result.rows[0].id, role: result.rows[0].role });
      res.status(201).json({ token, user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
);

// Login
// src/routes/auth.js  ➜  dentro del handler /login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    console.log('📥 Login attempt:', email);          // 1️⃣  llega el request

    console.log('📤 Password recibido:', password);

    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      const user = result.rows[0];
      console.log('🔍 User found?', !!user);          // 2️⃣  existe el mail
      console.log('📤 Password recibido:', user?.password);
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

      const match = await comparePassword(password, user.password);
      console.log('🔑 Password match?', match);       // 3️⃣  coincide el pass

      if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

      const token = signToken({ id: user.id, role: user.role });
      console.log('✅ Login OK, token emitido');      // 4️⃣  todo OK

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error('💥 Error en login:', err);       // 5️⃣  cualquier fallo SQL
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
);

// Endpoint protegido para verificar token y rol
router.get('/me', authRequired(), async (req, res) => {
  try {
    const { id } = req.user;
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
