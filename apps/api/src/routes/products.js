import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * GET /api/v1/products
 * Devuelve todos los productos (ordenados por nombre)
 * Ejemplo de consulta: SELECT * FROM products ORDER BY name;
 */
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         p.id, p.name, p.description, p.image_url AS "imageUrl",
         p.price, p.stock,
         c.name            AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.name`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
