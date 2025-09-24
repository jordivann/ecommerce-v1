// src/routes/checkout.js
import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';
import { authRequired } from '../middlewares/authMiddleware.js'; // usa JWT de tu middleware :contentReference[oaicite:0]{index=0}

const router = Router();

/**
 * POST /api/v1/checkout/init
 * body: { channel: 'whatsapp' | 'mercadopago' }
 * Crea la orden a partir del carrito del usuario (transacción atómica)
 */
router.post('/init', authRequired(), async (req, res) => {
  const userId = req.user.id;
  const { channel = 'whatsapp' } = req.body;

  const client = await pool.connect(); // usa tu pool PG :contentReference[oaicite:1]{index=1}
  try {
    await client.query('BEGIN');

    // 1) Carrito + lock de productos (para stock)
    const { rows: items } = await client.query(`
      SELECT p.id   AS product_id,
             p.name,
             p.price,
             p.stock,
             c.quantity
      FROM cart_items c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = $1
      FOR UPDATE OF p
    `, [userId]);

    if (items.length === 0) {
      throw new Error('Carrito vacío');
    }

    // 2) Validar stock
    for (const it of items) {
      if (Number(it.stock) < Number(it.quantity)) {
        throw new Error(`Sin stock de ${it.name}`);
      }
    }

    // 3) Totales (simple por ahora)
    const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
    const shipping = 0, discount = 0, tax = 0;
    const total = subtotal - discount + shipping + tax;

    // 4) Snapshot de datos del usuario (para no depender de cambios futuros)
    const { rows: [profile] } = await client.query(`
      SELECT name, email, phone, document_number, address, city, postal_code, country
      FROM users WHERE id = $1
    `, [userId]);

    const shipping_address = {
      name: profile?.name,
      phone: profile?.phone,
      address: profile?.address,
      city: profile?.city,
      postal_code: profile?.postal_code,
      country: profile?.country
    };
    const billing_info = {
      name: profile?.name,
      email: profile?.email,
      document_number: profile?.document_number
    };

    // 5) Crear orden (con idempotencia básica)
    const idem = crypto.randomUUID();
    const { rows: [order] } = await client.query(`
      INSERT INTO orders (
        user_id, status, payment_status, channel,
        currency, subtotal, discount, shipping_cost, tax, total,
        shipping_address, billing_info, idempotency_key, created_at, updated_at
      )
      VALUES (
        $1, 'pending_payment', 'pending', $2,
        'ARS', $3, $4, $5, $6, $7,
        $8, $9, $10, NOW(), NOW()
      )
      RETURNING id
    `, [userId, channel, subtotal, discount, shipping, tax, total, shipping_address, billing_info, idem]);

    const orderId = order.id;

    // 6) Insertar items + descontar stock
    const insertItemSQL = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (order_id, product_id) DO UPDATE
      SET quantity = EXCLUDED.quantity, unit_price = EXCLUDED.unit_price
    `;
    for (const it of items) {
      await client.query(insertItemSQL, [orderId, it.product_id, it.quantity, it.price]);
      await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [it.quantity, it.product_id]);
    }

    // 7) Vaciar carrito del usuario
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    // 8) Registrar pago "pending"
    const method = (channel === 'mercadopago') ? 'mercadopago' : 'manual';
    await client.query(`
      INSERT INTO payments (order_id, amount, method, status, currency, created_at)
      VALUES ($1, $2, $3, 'pending', 'ARS', NOW())
    `, [orderId, total, method]);

    await client.query('COMMIT');

    // 9) Devolver acción según canal
    if (channel === 'whatsapp') {
      const msg = encodeURIComponent(`Hola! Quiero confirmar la orden #${orderId} por ${total.toFixed(2)} ARS`);
      const wa = `https://wa.me/5493510000000?text=${msg}`; // poné tu número
      return res.json({ orderId, total, pay_url: wa });
    } else {
      // MP (futuro): acá devolverías preferenceId / init_point
      return res.json({ orderId, total, mp_init_point: null });
    }

  } catch (e) {
    await client.query('ROLLBACK');
    return res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});

export default router;
