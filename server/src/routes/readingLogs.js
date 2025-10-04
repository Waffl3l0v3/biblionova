const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Add reading log
router.post('/', authMiddleware, async (req,res) => {
  const { book_id, pages_read } = req.body;
  const user_id = req.user.user_id;
  if (!book_id || !pages_read) return res.status(400).json({ error: 'Missing book_id or pages_read' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO reading_logs (user_id, book_id, pages_read) VALUES ($1,$2,$3) RETURNING *',
      [user_id, book_id, pages_read]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
