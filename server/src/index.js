// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// ---- helper middleware (simple) ----
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { user_id, name, email }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ---- Auth: register/login ----
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const insert = await pool.query(
      'INSERT INTO users (name, email, password, total_xp) VALUES ($1,$2,$3,0) RETURNING user_id, name, email, total_xp',
      [name, email, hash]
    );
    const user = insert.rows[0];
    const token = jwt.sign({ user_id: user.user_id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ error: 'Email already in use' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const { rows } = await pool.query('SELECT user_id, name, email, password FROM users WHERE email=$1', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { user_id: user.user_id, name: user.name, email: user.email }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- Public: get books ----
app.get('/api/books', async (req,res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---- Add reading log (user logs pages read) ----
app.post('/api/reading-logs', authMiddleware, async (req,res) => {
  const { book_id, pages_read } = req.body;
  const user_id = req.user.user_id;
  if (!book_id || !pages_read) return res.status(400).json({ error: 'Missing book_id or pages_read' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO reading_logs (user_id, book_id, pages_read) VALUES ($1,$2,$3) RETURNING *',
      [user_id, book_id, pages_read]
    );
    // trigger in DB will update users.total_xp automatically
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---- Leaderboard ----
app.get('/api/leaderboard', async (req,res) => {
  try {
    const { rows } = await pool.query('SELECT user_id, name, total_xp FROM users ORDER BY total_xp DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---- User stats (pages read by genre etc.) ----
app.get('/api/users/:id/stats', async (req,res) => {
  const uid = parseInt(req.params.id, 10);
  try {
    const total = await pool.query('SELECT total_xp FROM users WHERE user_id=$1', [uid]);
    const pagesByGenre = await pool.query(`
      SELECT b.genre, SUM(r.pages_read) as total_pages
      FROM reading_logs r JOIN books b ON r.book_id = b.book_id
      WHERE r.user_id = $1
      GROUP BY b.genre
      ORDER BY total_pages DESC
    `, [uid]);
    res.json({ total_xp: total.rows[0]?.total_xp || 0, pagesByGenre: pagesByGenre.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// ---- Badge check: award badges based on criteria ----
app.post('/api/badges/check/:userId', authMiddleware, async (req,res) => {
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
        if (parseInt(cnt,10) >= 2 || parseInt(cnt,10) >= parseInt(b.criteria_value || '2',10)) qualifies = true; // flexible
      }
      if (qualifies) {
        // insert into user_badges if not exists
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
