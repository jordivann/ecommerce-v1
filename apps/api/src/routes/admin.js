// src/routes/admin.js
import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta de bienvenida al dashboard admin
router.get('/dashboard', authRequired('admin'), async (req, res) => {
  res.json({ message: `Bienvenido al panel admin, usuario ID: ${req.user.id}` });
});

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

// Actualizar rol de usuario (por ejemplo, promover a admin)
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

// Obtener resumen de productos
router.get('/products', authRequired('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.price,
        p.stock,
        p.category_id,
        c.name AS category,
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
// Editar un producto
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, stock = $4, category_id = $5
       WHERE id = $6
       RETURNING *`,
      [name, description, price, stock, category_id, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ message: 'Producto actualizado', product: result.rows[0] });
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ error: 'Error al editar producto' });
  }
});

// Eliminar un producto
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

router.get('/categories', authRequired('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});
// Actualizar categoría de un producto
router.put('/products/:id/category', authRequired('admin'), async (req, res) => {
  const { id } = req.params;
  const { category_id } = req.body;

  try {
    const update = await pool.query(
      'UPDATE products SET category_id = $1 WHERE id = $2 RETURNING id',
      [category_id || null, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const catName = category_id
      ? (await pool.query('SELECT name FROM categories WHERE id = $1', [category_id])).rows[0]?.name
      : '';

    res.json({ message: 'Categoría actualizada', category_name: catName });
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

export default router;
