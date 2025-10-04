const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all books
router.get('/', async (req,res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
