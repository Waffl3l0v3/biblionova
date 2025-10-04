import express from "express";
import pool from "../db.js"; // your PostgreSQL pool connection

const router = express.Router();

// 1. Get user XP, streak, and badges
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userRes = await pool.query(
      "SELECT username, xp, streak_count FROM users WHERE user_id = $1",
      [userId]
    );
    const badgesRes = await pool.query(
      `SELECT b.name, b.description 
       FROM badges b
       JOIN user_badges ub ON b.badge_id = ub.badge_id
       WHERE ub.user_id = $1`,
      [userId]
    );

    res.json({
      user: userRes.rows[0],
      badges: badgesRes.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 2. Add XP to user
router.post("/:userId/addXP", async (req, res) => {
  const { userId } = req.params;
  const { xp } = req.body;
  try {
    const updateRes = await pool.query(
      "UPDATE users SET xp = xp + $1 WHERE user_id = $2 RETURNING *",
      [xp, userId]
    );
    res.json(updateRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 3. Award a badge to user
router.post("/:userId/addBadge", async (req, res) => {
  const { userId } = req.params;
  const { badgeId } = req.body;
  try {
    const insertRes = await pool.query(
      "INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) RETURNING *",
      [userId, badgeId]
    );
    res.json(insertRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
