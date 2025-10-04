const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Check and award badges
router.post('/check/:userId', authMiddleware, async (req,res) => {
  const uid = parseInt(req.params.userId, 10);
  try {
    const badges = (await pool.query('SELECT * FROM badges')).rows;
    const awarded = [];
    for (const b of badges) {
      let qualifies = false;
      if (b.criteria_type === 'pages') {
        const sum = (await pool.query('SELECT COALESCE(SUM(pages_read),0) as s FROM reading_logs WHERE user_id=$1', [uid])).rows[0].s;
        if (parseInt(sum,10) >= parseInt(b.criteria_value,10)) qualifies = true;
      } else if (b.criteria_type === 'books') {
        const cnt = (await pool.query('SELECT COUNT(DISTINCT book_id) as c FROM reading_logs WHERE user_id=$1', [uid])).rows[0].c;
        if (parseInt(cnt,10) >= parseInt(b.criteria_value,10)) qualifies = true;
      } else if (b.criteria_type === 'genre') {
        const cnt = (await pool.query(`
          SELECT COUNT(DISTINCT r.book_id) as c
          FROM reading_logs r JOIN books b ON r.book_id=b.book_id
          WHERE r.user_id=$1 AND b.genre = $2
        `, [uid, b.criteria_value])).rows[0].c;
        if (parseInt(cnt,10) >= 2 || parseInt(cnt,10) >= parseInt(b.criteria_value || '2',10)) qualifies = true;
      }
      if (qualifies) {
        const exists = (await pool.query('SELECT 1 FROM user_badges WHERE user_id=$1 AND badge_id=$2', [uid, b.id])).rows.length;
        if (!exists) {
          await pool.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1,$2)', [uid, b.id]);
          awarded.push(b);
        }
      }
    }
    res.json({ awarded });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
