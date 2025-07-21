

import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// ==============================
// 🏁 Dashboard admin welcome
// ==============================
router.get('/dashboard', authRequired('admin'), async (req, res) => {
  res.json({ message: `Bienvenido al panel admin, usuario ID: ${req.user.id} `});
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
// 📦 Productos (Admin)
// ==============================

// Obtener todos los productos (admin)
router.get('/products', authRequired('admin'), async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        c.name AS category
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

// Crear producto (con lógica inteligente)
router.post('/products', authRequired('admin'), async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      original_price,
      stock,
      category_id,
      image_url,
      brand,
      tags,
      unit,
      visible = true,
      discount_expiration,
    } = req.body;

    if (!name || !original_price || isNaN(original_price)) {
      return res.status(400).json({ error: 'Nombre y precio original son obligatorios' });
    }

    original_price = parseFloat(original_price);
    price = parseFloat(price);

    // Descuento automático
    let discount_percentage = 0;
    if (price && original_price && price < original_price) {
      discount_percentage = Math.round(100 * (1 - price / original_price));
    } else {
      price = original_price;
    }

    // Si descuento expiró → reiniciar
    if (discount_expiration && new Date(discount_expiration) < new Date()) {
      discount_percentage = 0;
      price = original_price;
    }

    // Stock visible automático
    if (stock === 0) {
      visible = false;
    }

    const result = await pool.query(`
      INSERT INTO products (
        name, description, price, original_price, discount_percentage,
        stock, category_id, image_url, brand, tags, unit, visible,
        discount_expiration, created_at, updated_at,
        weight_grams, dimensions, organic, senasa, rendimiento
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12,
        $13, NOW(), NOW(),
        $14, $15, $16, $17, $18
      ) RETURNING *;
    `, [
      name.trim(), description?.trim(), price, original_price, discount_percentage,
      stock, category_id, image_url, brand?.trim(), tags, unit, visible,
      discount_expiration,
      weight_grams, dimensions, organic, senasa, rendimiento
    ]);

    res.status(201).json({ message: 'Producto creado', product: result.rows[0] });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});
router.put('/products/:id', authRequired('admin'), async (req, res) => {
  const { id } = req.params;
  let {
    name,
    description,
    price,
    original_price,
    stock,
    category_id,
    image_url,
    brand,
    tags,
    unit,
    visible,
    discount_expiration,
    weight_grams,
    dimensions,
    organic,
    senasa,
    rendimiento
  } = req.body;

  try {
    // Limpieza extra: si no hay descuento real, quitar fecha
    if (
      price !== undefined &&
      original_price !== undefined &&
      parseFloat(price) === parseFloat(original_price)
    ) {
      discount_expiration = null;
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (price !== undefined) {
      price = parseFloat(price);
      fields.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (original_price !== undefined) {
      original_price = parseFloat(original_price);
      fields.push(`original_price = $${paramIndex++}`);
      values.push(original_price);
    }
    if (stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(stock);
      if (stock === 0 && visible === undefined) {
        visible = false;
      }
    }
    if (category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(category_id);
    }
    if (image_url !== undefined) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(image_url);
    }

    if (tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(tags);
    }
    if (unit !== undefined) {
      fields.push(`unit = $${paramIndex++}`);
      values.push(unit);
    }
    if (visible !== undefined) {
      fields.push(`visible = $${paramIndex++}`);
      values.push(visible);
    }

    if (weight_grams !== undefined) {
      fields.push(`weight_grams = $${paramIndex++}`);
      values.push(weight_grams);
    }
    if (dimensions !== undefined) {
      fields.push(`dimensions = $${paramIndex++}`);
      values.push(dimensions);
    }
    if (organic !== undefined) {
      fields.push(`organic = $${paramIndex++}`);
      values.push(organic);
    }
    if (senasa !== undefined) {
      fields.push(`senasa = $${paramIndex++}`);
      values.push(senasa);
    }
    if (rendimiento !== undefined) {
      fields.push(`rendimiento = $${paramIndex++}`);
      values.push(rendimiento);
    }
    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(typeof name === 'string' ? name.trim() : '');
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(typeof description === 'string' ? description.trim() : '');
    }
    if (brand !== undefined) {
      fields.push(`brand = $${paramIndex++}`);
      values.push(typeof brand === 'string' ? brand.trim() : '');
    }


    // Cálculo de descuento inteligente
   if (price !== undefined && original_price !== undefined) {
      let discount = 0;

      // Si se especificó una fecha y ya expiró → cancelar descuento
      if (discount_expiration && new Date(discount_expiration) < new Date()) {
        discount = 0;
        price = original_price;

        fields.push(`price = $${paramIndex++}`);
        values.push(price);

        fields.push(`discount_expiration = $${paramIndex++}`);
        values.push(null); // limpiar fecha vencida
      }

      // Si el precio es menor que el original → calcular descuento
      else if (original_price > price) {
        discount = Math.round(100 * (1 - price / original_price));
      }

      // Si no hay descuento real → forzar limpieza de fecha
      if (discount === 0 && !fields.includes('discount_expiration')) {
        fields.push(`discount_expiration = $${paramIndex++}`);
        values.push(null);
      }

      fields.push(`discount_percentage = $${paramIndex++}`);
      values.push(discount);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ message: 'Producto actualizado', product: result.rows[0] });
  } catch (err) {
    console.error('Error al editar producto:', err.message, err.stack);
    res.status(500).json({ error: 'Error al editar producto' });
  }
});


export default router;
