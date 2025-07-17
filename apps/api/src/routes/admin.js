import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// ==============================
// 🏁 Dashboard admin welcome
// ==============================
router.get('/dashboard', authRequired('admin'), async (req, res) => {
  res.json({ message: `Bienvenido al panel admin, usuario ID: ${req.user.id}` });
});

// ==============================
// 👤 Usuarios
// ==============================

// Obtener todos los usuarios
router.get('/users', authRequired('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar rol de usuario
router.put('/users/:id/role', authRequired('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Rol actualizado', user: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar rol:', err);
    res.status(500).json({ error: 'Error al actualizar rol del usuario' });
  }
});

// ==============================
// 📦 Productos
// ==============================

// Obtener todos los productos (con nombre de categoría)
router.get('/products', authRequired('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category_id,
        c.name AS category,
        p.image_url,
        p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear producto
router.post('/products', authRequired('admin'), async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;

  // Validaciones manuales simples
  const nameRegex = /^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ\s]{2,100}$/;
  const descRegex = /^[\w\s.,;:¡!¿?"()\-]{0,300}$/;

  if (!name || !nameRegex.test(name.trim())) {
    return res.status(400).json({ error: 'Nombre inválido: solo letras y números, máx 100 caracteres' });
  }

  if (description && !descRegex.test(description.trim())) {
    return res.status(400).json({ error: 'Descripción inválida: caracteres no permitidos o muy larga (máx 300)' });
  }

  if (isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'Precio inválido' });
  }

  if (!Number.isInteger(Number(stock)) || stock < 0) {
    return res.status(400).json({ error: 'Stock inválido' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name.trim(), description?.trim(), price, stock, category_id]
    );

    res.status(201).json({ message: 'Producto creado', product: result.rows[0] });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Editar producto (actualización parcial)
router.put('/products/:id', authRequired('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, image_url } = req.body;

  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name.trim());
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(description.trim());
    }
    if (price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(stock);
    }
    if (category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(category_id);
    }
    if (image_url !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ message: 'Producto actualizado', product: result.rows[0] });
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ error: 'Error al editar producto' });
  }
});

// ==============================
// 📁 Categorías
// ==============================

router.get('/categories', authRequired('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;
