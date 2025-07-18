import { Router } from 'express';
import { authRequired } from '../middlewares/authMiddleware.js'; 
import { pool } from '../db.js';

const router = Router();

// GET /api/v1/profile
router.get('/profile', authRequired, async (req, res) => {
  try {
    const { id } = req.user;
    console.log('📥 GET /profile - Buscando usuario con ID:', id);

    const { rows } = await pool.query(
      `SELECT id, name, email, role, created_at,
              phone, document_number, address, city, postal_code, country
       FROM users
       WHERE id = $1`,
      [id]
    );

    console.log('🧾 Resultado de query:', rows); // <-- ESTE

    if (rows.length === 0) {
      console.log('⛔ Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario encontrado:', rows[0]); // <-- ESTE
    res.json(rows[0]); // <--- SI ESTO NO EJECUTA, NADA FUNCIONA
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



router.put('/profile', authRequired, async (req, res) => {
  const { id } = req.user;
  const {
    phone = '',
    document_number = '',
    address = '',
    city = '',
    postal_code = '',
    country = ''
  } = req.body;

  // Validaciones básicas
  const phoneRegex = /^[0-9]{6,20}$/;
  const docRegex = /^[a-zA-Z0-9.\-]{5,30}$/;
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/;
  const postalRegex = /^[a-zA-Z0-9\s\-]{2,20}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Teléfono inválido (solo números, entre 6 y 20 dígitos)' });
  }

  if (!docRegex.test(document_number)) {
    return res.status(400).json({ error: 'Documento inválido (hasta 30 caracteres alfanuméricos)' });
  }

  if (address.length < 10) {
    return res.status(400).json({ error: 'Dirección demasiado corta (mínimo 10 caracteres)' });
  }

  if (!textRegex.test(city)) {
    return res.status(400).json({ error: 'Ciudad inválida (solo letras y espacios)' });
  }

  if (!postalRegex.test(postal_code)) {
    return res.status(400).json({ error: 'Código postal inválido' });
  }

  if (!textRegex.test(country)) {
    return res.status(400).json({ error: 'País inválido' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET
        phone = $1,
        document_number = $2,
        address = $3,
        city = $4,
        postal_code = $5,
        country = $6
      WHERE id = $7
      RETURNING id, name, email, phone, document_number, address, city, postal_code, country`,
      [phone, document_number, address, city, postal_code, country, id]
    );

    res.json({ message: 'Datos de perfil actualizados', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});



export default router;
