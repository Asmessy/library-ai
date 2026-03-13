require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Run init DB scripts if database is empty
const initDB = async () => {
  try {
    const tableCheck = await db.getAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'");
    if (!tableCheck) {
      console.log("Initializing database schema...");
      const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
      const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
      
      const runTransaction = () => new Promise((resolve, reject) => {
          db.exec(schemaSql, (err) => {
              if (err) return reject(err);
              db.exec(seedSql, (err2) => {
                  if (err2) return reject(err2);
                  resolve();
              });
          });
      });
      await runTransaction();
      console.log("Database initialized and seeded.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
initDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes')); // Old basic recommendations
app.use('/api/recommendations', require('./routes/recommendationRoutes')); // Advanced AI recommendations
app.use('/api/profile', require('./routes/userProfileRoutes')); // User Profile and Timeline
app.use('/api/analytics', require('./routes/analyticsRoutes')); // Analytics for Admins

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
