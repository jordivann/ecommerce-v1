import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { pool } from './db.js';
import rootRouter from './routes/root.js';
import productsRouter from './routes/products.js';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 4000;
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1/admin', adminRouter);


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', rootRouter);
app.use('/api/v1/products', productsRouter);  

(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL vía Railway');
  } catch (err) {
    console.error('❌ Error al conectar con la DB:', err);
  }
})();


app.listen(PORT, () => console.log(`API running on port ${PORT}`));
