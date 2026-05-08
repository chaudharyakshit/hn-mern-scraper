const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { runScraper } = require('./scraper/hackerScraper');

const path = require('path');
dotenv.config();
connectDB();

const app = express();

// Middleware
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stories', require('./routes/story.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', env: process.env.NODE_ENV });
});

// Serve React build in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  runScraper();
});
