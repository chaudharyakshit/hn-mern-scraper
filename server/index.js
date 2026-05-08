const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'HN Board API' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stories', require('./routes/story.routes'));

// Scraper
const { runScraper } = require('./scraper/hackerScraper');

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  runScraper();
});
