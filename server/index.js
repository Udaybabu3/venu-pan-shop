const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('✅ Venu Pan Shop API is running 🧾');
});

// ✅ GET full inventory
app.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY ingredient_id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory:', err.message);
    res.status(500).json({ error: 'Server error while fetching inventory' });
  }
});

// ✅ POST usage log
app.post('/use', async (req, res) => {
  try {
    const { ingredient_id, used_amount } = req.body;
    await pool.query(
      'INSERT INTO usage_log (ingredient_id, used_amount) VALUES ($1, $2)',
      [ingredient_id, used_amount]
    );
    res.json({ message: '✅ Usage recorded' });
  } catch (err) {
    console.error('Error logging usage:', err.message);
    res.status(500).json({ error: 'Failed to log usage' });
  }
});

// ✅ POST incoming stock
app.post('/stock', async (req, res) => {
  try {
    const { ingredient_id, added_amount } = req.body;
    await pool.query(
      'INSERT INTO incoming_stock (ingredient_id, added_amount) VALUES ($1, $2)',
      [ingredient_id, added_amount]
    );
    res.json({ message: '✅ Stock added' });
  } catch (err) {
    console.error('Error adding stock:', err.message);
    res.status(500).json({ error: 'Failed to add stock' });
  }
});

// ✅ GET daily report: used today
app.get('/report/used-today', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.name AS ingredient, COALESCE(SUM(u.used_amount), 0) AS total_used
      FROM usage_log u
      JOIN ingredients i ON u.ingredient_id = i.ingredient_id
      WHERE u.usage_date = CURRENT_DATE
      GROUP BY i.name ORDER BY i.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching used-today report:', err.message);
    res.status(500).json({ error: 'Failed to fetch used-today report' });
  }
});

// ✅ GET daily report: stock received today
app.get('/report/stock-today', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.name AS ingredient, COALESCE(SUM(s.added_amount), 0) AS total_added
      FROM incoming_stock s
      JOIN ingredients i ON s.ingredient_id = i.ingredient_id
      WHERE s.arrival_date = CURRENT_DATE
      GROUP BY i.name ORDER BY i.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stock-today report:', err.message);
    res.status(500).json({ error: 'Failed to fetch stock-today report' });
  }
});

// ✅ GET reorder alert
app.get('/report/reorder', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name AS ingredient, current_stock, min_required
      FROM ingredients
      WHERE current_stock < min_required
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reorder report:', err.message);
    res.status(500).json({ error: 'Failed to fetch reorder report' });
  }
});

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
