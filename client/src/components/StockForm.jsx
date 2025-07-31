import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(express.json()); // ✅ Important to parse JSON body

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your DB URL from Vercel
});

// ✅ Add Stock Route
app.post('/stock', async (req, res) => {
  try {
    const { ingredient_id, added_amount } = req.body;

    // Input validation
    if (!ingredient_id || !added_amount) {
      return res.status(400).json({ error: 'Missing ingredient_id or added_amount' });
    }

    // Update stock in DB
    await pool.query(
      'UPDATE ingredients SET current_stock = current_stock + $1 WHERE ingredient_id = $2',
      [added_amount, ingredient_id]
    );

    res.json({ message: '✅ Stock updated successfully!' });
  } catch (err) {
    console.error('Add Stock Error:', err); // Log in Vercel
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

export default app;
