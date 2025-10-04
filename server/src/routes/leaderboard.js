const express = require('express');
const pool = require('../db');

const router = express.Router();

// Top 10 users by XP
router.get('/', async (req,res) => {
  try {
    const { rows } = await pool.query('SELECT user_id, name, total_xp FROM users ORDER BY total_xp DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
