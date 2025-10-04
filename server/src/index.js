require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const readingLogsRouter = require('./routes/readingLogs');
const leaderboardRouter = require('./routes/leaderboard');
const badgesRouter = require('./routes/badges');

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/reading-logs', readingLogsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/badges', badgesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
