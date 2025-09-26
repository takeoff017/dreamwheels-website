const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use environment variable for database path
const dbPath = path.resolve(__dirname, process.env.DB_PATH || 'database.sqlite');

// Simple database connection without complex setup
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Database connected at', dbPath);
    }
});

// Minimal table creation - just the essential tables
const createTables = () => {
    db.run(`CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        price REAL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        rating INTEGER,
        text TEXT
    )`);
};

// Default route
app.get('/', (req, res) => {
    res.send('✅ Backend server is running successfully!');
});

// Start server immediately (don't wait for database setup)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(🚀 Server running on port ${PORT});
    createTables(); // Create tables after server starts
});

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is healthy' });
});

// Export for testing
module.exports = app;
